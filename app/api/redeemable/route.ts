import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';
import {
  createRedeemable,
  getRedeemables,
  updateRedeemable,
  deleteRedeemable,
} from '@/actions/redeemable';
import { isRecordNotFoundError } from '@/utils/prisma';
import { GetRedeemableOptions, RedeemableSort } from '@/types/redeemable';

export async function POST(request: Request) {
  const res = await createRedeemable(await request.json());
  if (!res) return new Response('Invalid request', { status: 400 });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const limit = params.get('limit');

  const options: GetRedeemableOptions = {
    competitionCode: params.get('code') ?? undefined,
    name: params.get('name') ?? undefined,
    limit: limit ? parseInt(limit) : undefined,
    cursor: params.get('cursor') ?? undefined,
    sort: params.get('sort') as RedeemableSort,
  };

  try {
    return NextResponse.json(await getRedeemables(options));
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
