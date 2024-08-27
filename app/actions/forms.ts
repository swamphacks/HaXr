'use server';

import { Prisma, PrismaClient, Form, FormType } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { ApplicationResponse, FormSection } from '@/types/forms';
import { FormSettings } from '@/types/forms';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

const neon = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
});
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export async function getApplication(competition_code: string) {
  const resp = await prisma.competition.findFirst({
    where: {
      code: competition_code,
      application: {
        closes_at: {
          gte: new Date(),
        },
        is_published: true,
      },
      OR: [
        {
          application: {
            opens_at: null,
          },
        },
        {
          application: {
            opens_at: {
              lte: new Date(),
            },
          },
        },
      ],
    },
    include: {
      application: true,
    },
  });
  return resp;
}

function constructFilename(
  competitionCode: string,
  formId: string,
  responseId: string,
  questionId: string,
  file: File
) {
  return `${competitionCode}/forms/${formId}/responses/${responseId}/${questionId}/${file.name}`;
}

export async function uploadFile(
  competitionCode: string,
  formId: string,
  responseId: string,
  questionId: string,
  formData: FormData
) {
  const file = formData.get('file') as File;
  const filename = constructFilename(
    competitionCode,
    formId,
    responseId,
    questionId,
    file
  );
  const resp = await put(filename, file, { access: 'public' });
  revalidatePath('/');
  if (!resp) {
    return null;
  }
  return resp;
}

export async function deleteFile(url: string) {
  try {
    await del(url);
  } catch {
    // del should throw an error if the url is invalid
    console.log('Failed to delete file with url: ', url);
  }
}

export async function getForm(formId: string) {
  const form = await prisma.form.findFirst({
    where: {
      id: formId,
      // closes_at: {
      // 	// lte: new Date(),
      // },
    },
  });
  return form;
}

export async function createForm(competitionCode: string, formType: FormType) {
  return await prisma.form.create({
    data: {
      competition_code: competitionCode,
      form_type: formType,
    },
  });
}

export async function updateForm(form: Form, sections: FormSection[]) {
  // ensure the form is not published
  const resp = await prisma.form.update({
    where: {
      id: form.id,
      is_published: false,
    },
    data: {
      ...form,
      sections: sections as unknown as Prisma.JsonArray,
    },
  });

  return resp;
}

export async function updateFormSettings(form: Form) {
  // remove sections and is_mlh from the form object
  // we don't want to edit questions because the form may be published
  const clone = (({ id, sections, is_mlh, ...rest }) => rest)(form);

  const resp = await prisma.form.update({
    where: {
      id: form.id,
    },
    data: {
      ...clone,
    },
  });

  return resp;
}

export async function saveAndPublishForm(
  form: Form,
  sections: FormSection[],
  settings: FormSettings
) {
  const resp = await prisma.form.update({
    where: {
      id: form.id,
    },
    data: {
      ...form,
      ...settings,
      sections: sections as unknown as Prisma.JsonArray,
      is_published: true,
    },
  });

  return resp;
}

export async function publishForm(form: Form, sections: FormSection[]) {
  const resp = await prisma.form.update({
    where: {
      id: form.id,
      is_published: false,
    },
    data: {
      ...form,
      sections: sections as unknown as Prisma.JsonArray,
      is_published: true,
    },
  });

  return resp;
}

export async function getUser(email: string) {
  const resp = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return resp;
}

export async function getFormResponse(
  formId: string,
  userId: string,
  initialValues: React.MutableRefObject<Record<string, any>>
) {
  let resp = await prisma.response.findFirst({
    where: {
      form_id: formId,
      submitted_by_id: userId,
    },
  });

  // Create a new response if it doesn't exist
  if (!resp) {
    resp = await prisma.response.create({
      data: {
        submitted_by_id: userId,
        form_id: formId,
        answers: initialValues.current,
      },
    });
  }
  return resp;
}

export async function saveResponse(
  userId: string,
  responseId: string,
  responses: Record<string, string>
) {
  const resp = await prisma.response.update({
    where: {
      id: responseId,
      submitted: false,
      submitted_by_id: userId,
    },
    data: {
      answers: responses,
    },
  });

  return resp;
}

export async function submitResponse(
  userId: string,
  responseId: string,
  responses: Record<string, string>
) {
  try {
    const resp = await prisma.response.update({
      where: {
        id: responseId,
        submitted: false,
        submitted_by_id: userId,
      },
      data: {
        answers: responses,
        submitted: true,
      },
    });
    return resp;
  } catch {
    return null;
  }
}
