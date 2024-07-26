'use server';

import {
  Prisma,
  PrismaClient,
  Form,
  FormType,
  FormSettings,
} from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { ApplicationResponse, FormSection } from '@/types/forms';

const neon = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
});
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

export async function getApplication(competition_code: string) {
  const resp = prisma.competition.findFirst({
    where: {
      code: competition_code,
    },
    include: {
      application: true,
    },
  });
  return resp;
}

export async function getForm(formId: string) {
  const form = await prisma.form.findFirst({
    where: {
      id: formId,
    },
    include: {
      settings: true,
    },
  });
  return form;
}

export async function createForm(competitionCode: string, formType: FormType) {
  const settings = await prisma.formSettings.create({
    data: {},
  });

  return await prisma.form.create({
    data: {
      competition_code: competitionCode,
      settings_id: settings.id,
      form_type: formType,
    },
  });
}

export async function updateForm(
  form: Form,
  settings: FormSettings,
  sections: FormSection[]
) {
  const resp = await prisma.form.update({
    where: {
      id: form.id,
    },
    data: {
      title: form.title,
      is_published: form.is_published,
      sections: sections as unknown as Prisma.JsonArray,
      settings: {
        update: settings,
      },
    },
  });

  return resp;
}

export async function createResponse(
  formId: string,
  userId: string,
  answers: Record<string, string>
) {
  const resp = await prisma.response.create({
    data: {
      form_id: formId,
      submitted_by_id: userId,
      answers: answers,
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
  responseId: string,
  responses: Record<string, string>
) {
  const resp = await prisma.response.update({
    where: {
      id: responseId,
      submitted: false,
    },
    data: {
      answers: responses,
    },
  });

  return resp;
}

export async function submitResponse(
  responseId: string,
  responses: Record<string, string>
) {
  const resp = await prisma.response.update({
    where: {
      id: responseId,
    },
    data: {
      answers: responses,
      submitted: true,
    },
  });

  return resp;
}
