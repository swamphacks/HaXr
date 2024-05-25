'use server'

import { FormQuestion, AddressQuestion, FileQuestion, Agreement, SelectionQuestion, questionType } from '@/types/questionTypes';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

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
					answer_choices: selectionQuestion.answerChoices?.map((choice) => {
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

export async function createForm(competitionCode: string, title: string, questions: FormQuestion[]) {
	const form = await prisma.form.create({
		data: {
			competition_code: competitionCode,
			title: title,
			questions: {
				create: convertQuestions(questions)
			},
		},
	});

	return form;
}

export async function saveForm(competitionCode: string, title: string, questions: FormQuestion[], isPrimary?: boolean) {
}
