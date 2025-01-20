import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';
import { createRedeemable, getRedeemables, updateRedeemable, deleteRedeemable } from '@/actions/redeemable';
import { isRecordNotFoundError } from '@/utils/prisma';

export async function POST(request: Request) {
	const res = await createRedeemable(await request.json());
	if (!res) return new Response('Invalid request', { status: 400 });
}

export async function GET(request: Request) {
	const url = new URL(request.url);

	try {
		return NextResponse.json(await getRedeemables(url.searchParams.get('code')));
	} catch (e) {
		if (e instanceof ValidationError)
			return new Response(null, { status: 400, statusText: e.message });
		throw e;
	}
}

/* Update a redeemable */
export async function PUT(request: Request) {
	try {
		await updateRedeemable(await request.json());
	} catch (e) {
		if (e instanceof ValidationError)
			return new Response(null, { status: 400, statusText: e.message });
		else if (isRecordNotFoundError(e))
			return new Response(null, { status: 404 });
		throw e;
	}
}

/* Delete a redeemable */
export async function DELETE(request: Request) {
	try {
		await deleteRedeemable(await request.json());
	} catch (e) {
		if (e instanceof ValidationError)
			return new Response(null, { status: 400, statusText: e.message });
		else if (isRecordNotFoundError(e))
			return new Response(null, { status: 404 });
		throw e;
	}
}

