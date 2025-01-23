import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';
import { createRedeemable, getRedeemables } from '@/actions/redeemable';
import { Prisma } from '@prisma/client';
import { isRecordNotFoundError } from '@/utils/prisma';
import { GetRedeemableOptions } from '@/types/redeemable';

export async function POST(request: Request) {
	try {
		const resp = await createRedeemable(await request.json());
		return new NextResponse(null, { status: resp.status, statusText: resp.statusText });
	} catch (e) {
		if (e instanceof SyntaxError) {
			return new NextResponse(null, {
				status: 400,
				statusText: 'Invalid JSON',
			});
		}
		throw e;
	}
}

export async function GET(request: Request) {
	const params = new URL(request.url).searchParams;

	const limit = params.get('limit');

	const options: GetRedeemableOptions = {
		competitionCode: params.get('competitionCode') ?? undefined,
		name: params.get('name') ?? undefined,
		limit: limit ? parseInt(limit) : undefined,
		sort: params.get('sort') ?? undefined,
		cursor: {
			competitionCode: params.get('cursorCode') ?? undefined,
			name: params.get('cursorName') ?? undefined,
		},
	};

	try {
		return NextResponse.json(await getRedeemables(options));
	} catch (e) {
		if (e instanceof ValidationError)
			return new Response(null, { status: 400, statusText: e.message });
		throw e;
	}
}
