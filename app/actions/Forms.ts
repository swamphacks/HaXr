'use server';

import { Prisma, PrismaClient, Form, FormType } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { ApplicationResponse, FormSection } from '@/types/forms';

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
					gte: new Date()
				}
			}
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
			closes_at: {
				lte: new Date()
			}
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
			submitted: false,
		},
		data: {
			answers: responses,
			submitted: true,
		},
	});

	return resp;
}
