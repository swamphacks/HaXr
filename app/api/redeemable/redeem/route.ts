import { NextResponse } from 'next/server';
import { createTransaction } from '@/actions/redeemable';

export async function POST(request: Request) {
  try {
    const resp = await createTransaction(await request.json());
    return new NextResponse(null, {
      status: resp.status,
      statusText: resp.statusText,
    });
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
