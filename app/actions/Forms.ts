'use server';

import {
  FormQuestion,
  SelectionQuestion,
  questionType,
} from '@/types/questionTypes';
import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Form, FormSettings } from '@prisma/client';
import { requiredQuestions } from '@/types/questionTypes';
import { ApplicationResponse } from '@/types/forms';

// Edge connection
const neon = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
});
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });

function convertQuestions(questions: FormQuestion[]) {
  return questions.map((question: FormQuestion) => {
    switch (question.type) {
      case questionType.multiplechoice:
      case questionType.checkbox:
      case questionType.dropdown:
        const selectionQuestion = question as SelectionQuestion;
        return {
          ...question,
          answer_choices:
            selectionQuestion.answerChoices?.map((choice) => {
              return {
                value: choice.value,
                id: choice.id,
                other: choice.other,
              };
            }) || [],
        };
    }
  });
}

export async function createForm(competitionCode: string) {
  const form_settings = await prisma.formSettings.create({
    data: {},
  });

  return await prisma.form.create({
    data: {
      competition_code: competitionCode,
      questions: requiredQuestions as unknown as Prisma.JsonArray,
      form_settings_id: form_settings.id,
    },
  });
}

export async function updateForm(
  form: Form,
  questions: FormQuestion[],
  formSettings: FormSettings
) {
  const resp = await prisma.form.update({
    where: {
      id: form.id,
    },
    data: {
      title: form.title,
      is_primary: form.is_primary,
      is_published: form.is_published,
      questions:
        (questions as unknown as Prisma.JsonArray) || form.questions || [],
      form_settings: {
        update: {
          ...formSettings,
        },
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

export async function getResponse(
  formId: string,
  userId: string
): Promise<ApplicationResponse> {
  // let resp = await prisma.response.findFirst({
  // 	where: {
  // 		form_id: formId,
  // 		submitted_by_id: userId,
  // 	},
  // });
  //
  // // Create a new response if it doesn't exist
  // if (!resp) {
  // 	resp = await prisma.response.create({
  // 		data: {
  // 			form_id: formId,
  // 			submitted_by_id: userId,
  // 			answers: responses,
  // 		},
  // 	});
  // }
  // return resp;
  return {
    general: [
      {
        key: '1',
        value: 'Matthew',
      },
      {
        key: '2',
        value: 'DeGuzman',
      },
      {
        key: '3',
        value: '18-24',
      },
      {
        key: '4',
        value: 'matthew@ufl.edu',
      },
      {
        key: '5',
        value: 'University of Florida',
      },
      {
        key: '6',
        value: 'Other',
      },
      {
        key: '7',
        value: 'Computer Science',
      },
      {
        key: '8',
        value: 'Florida',
      },
      {
        key: '9',
        value: 'Yes',
      },
      {
        key: '10',
        value: 'Man',
      },
      {
        key: '11',
        value: 'Other',
      },
      {
        key: '12',
        value: 'White',
      },
    ],
    agreements: [
      {
        key: '13',
        value: true,
      },
      {
        key: '14',
        value: true,
      },
      {
        key: '15',
        value: false,
      },
    ],
    sections: {
      shortAnswer: [
        {
          key: '16',
          value: 'I am excited to hack at this hackathon.',
        },
        {
          key: '17',
          value: 'I am proud of making this.',
        },
        {
          key: '18',
          value: 'I would like to make money.',
        },
      ],
    },
  };
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
