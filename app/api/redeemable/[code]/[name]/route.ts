import { NextResponse } from 'next/server';
import {
  updateRedeemable,
  deleteRedeemable,
  getRedeemable,
} from '@/actions/redeemable';
import { Prisma } from '@prisma/client';
import { UpdateRedeemableBody } from '@/types/redeemable';

/* Update a redeemable */
export async function PUT(
  request: Request,
  { params }: { params: { code: string; name: string } }
) {
  try {
    const resp = await updateRedeemable(params.code, params.name, {
      ...(await request.json()),
    } as UpdateRedeemableBody);
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

export async function DELETE(
  request: Request,
  { params }: { params: { code: string; name: string } }
) {
  const resp = await deleteRedeemable(params.code, params.name);
  return new NextResponse(null, {
    status: resp.status,
    statusText: resp.statusText,
  });
}

export async function GET(
  request: Request,
  { params }: { params: { code: string; name: string } }
) {
  const resp = await getRedeemable(params.code, params.name);
  if (resp.status === 200) return NextResponse.json(resp.data);
  {
  }

  return new NextResponse(null, {
    status: resp.status,
    statusText: resp.statusText,
  });
}
