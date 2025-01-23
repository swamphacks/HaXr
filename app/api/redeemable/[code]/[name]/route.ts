import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';
import {
	updateRedeemable,
	deleteRedeemable,
	getRedeemable,
} from '@/actions/redeemable';
import { Prisma } from '@prisma/client';
import { isRecordNotFoundError } from '@/utils/prisma';
import { UpdateRedeemableBody } from '@/types/redeemable';

/* Update a redeemable */
export async function PUT(
	request: Request,
	{ params }: { params: { code: string; name: string } }
) {
	try {
		const resp = await updateRedeemable({
			...(await request.json()),
			competitionCode: params.code,
			name: params.name,
		} as UpdateRedeemableBody);
		return new NextResponse(null, { status: resp.status, statusText: resp.statusText });
	} catch (e) {
		if (e instanceof SyntaxError)
			return new Response(null, { status: 400, statusText: 'Invalid JSON' });
		throw e;
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { code: string; name: string } }
) {
	try {
		await deleteRedeemable(params.code, params.name);
		return new NextResponse(null, { status: 204 });
	} catch (e) {
		if (isRecordNotFoundError(e)) return new Response(null, { status: 404 });
		throw e;
	}
}

export async function GET(
	request: Request,
	{ params }: { params: { code: string; name: string } }
) {
	try {
		const redeemable = await getRedeemable(params.code, params.name);
		return NextResponse.json(redeemable);
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2025':
					return new Response(null, { status: 404 });
			}
		}

		throw e;
	}
}
