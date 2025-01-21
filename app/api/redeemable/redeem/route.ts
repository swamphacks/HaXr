import { ValidationError } from 'yup';
import { InsufficientFundsError } from '@/types/redeemable';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { createTransaction } from '@/actions/transaction';

export async function POST(request: Request) {
  try {
    await createTransaction(await request.json());
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    if (e instanceof SyntaxError) {
      return new NextResponse(null, {
        status: 400,
        statusText: 'Invalid JSON',
      });
    }
    if (e instanceof ValidationError)
      return new NextResponse(null, { status: 400, statusText: e.message });
    if (e instanceof InsufficientFundsError)
      return new NextResponse(null, { status: 403, statusText: e.message });
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      switch (e.code) {
        case 'P2003':
          return new NextResponse(null, {
            status: 404,
            statusText: 'competitionCode, userId, or redeemableName not found',
          });
      }
    }
    throw e;
  }
}
