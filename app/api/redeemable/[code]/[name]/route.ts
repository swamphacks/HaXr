import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';
import {
	updateRedeemable,
	deleteRedeemable,
	getRedeemable,
} from '@/actions/redeemable';
import { Prisma } from '@prisma/client';
import { isRecordNotFoundError } from '@/utils/prisma';

/* Update a redeemable */
export async function PUT(
	request: Request,
	{ params }: { params: { code: string; name: string } }
) {
	try {
		await updateRedeemable(params.code, params.name, await request.json());
		return new NextResponse(null, { status: 204 });
	} catch (e) {
		if (e instanceof SyntaxError)
			return new Response(null, { status: 400, statusText: 'Invalid JSON' });
		if (e instanceof ValidationError)
			return new Response(null, { status: 400, statusText: e.message });
		else if (isRecordNotFoundError(e))
			return new Response(null, { status: 404 });
		else if (e instanceof Prisma.PrismaClientKnownRequestError) {
			switch (e.code) {
				case 'P2002':
					return new Response(null, {
						status: 409,
						statusText: 'Redeemable already exists',
					});
				case 'P2003':
					return new Response(null, {
						status: 404,
						statusText: 'Competition does not exist',
					});
			}
		}
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
