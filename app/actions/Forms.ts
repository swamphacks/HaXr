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
