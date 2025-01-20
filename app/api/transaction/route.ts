import { ValidationError } from 'yup';
import {
  TransactionInfo,
  GetTransactionOptions,
  TransactionSort,
} from '@/types/transaction';
import { NextResponse } from 'next/server';
import { createTransaction, getTransactions } from '@/actions/transaction';

export async function POST(request: Request) {
  try {
    await createTransaction(await request.json());
  } catch (e) {
    if (e instanceof ValidationError)
      return new Response(null, { status: 400, statusText: e.message });
    throw e;
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const limit = params.get('limit');
  const sort = params.get('sort');

  const options: GetTransactionOptions = {
    limit: limit ? parseInt(limit) : undefined,
    cursor: params.get('cursor') ?? undefined,
    sort: sort ? (sort as TransactionSort) : undefined,
    competitionCode: params.get('code') ?? undefined,
    userId: params.get('userId') ?? undefined,
    redeemableName: params.get('redeemableName') ?? undefined,
  };

  try {
    return NextResponse.json(await getTransactions(options));
  } catch (e) {
    if (e instanceof ValidationError)
      return new Response(null, { status: 400, statusText: e.message });
    throw e;
  }
}
