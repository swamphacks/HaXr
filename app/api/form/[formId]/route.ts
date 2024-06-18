import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

export async function GET(
	req: NextRequest,
	{ params }: { params: { formId: string } }): Promise<Response> {
	const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
	const adapter = new PrismaNeon(neon);
	const prisma = new PrismaClient({ adapter });

	const form = await prisma.form.findFirst({
		where: {
			id: params.formId,
		},
		include: {
			form_settings: true,
		}
	});

	if (!form) {
		return NextResponse.json(
			{ error: 'Form not found' },
			{ status: 404 }
		)
	}

	return NextResponse.json(form);
}
