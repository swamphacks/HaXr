import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
import { StatusCodes } from 'http-status-codes';

export interface RemoveInterestedPersonRequest {
  email: string;
}

export async function POST(
  req: NextRequest,
  { params: { code } }: { params: { code: string } }
) {
  const competition = await prisma.competition.findUnique({ where: { code } });
  if (!competition) {
    return NextResponse.json(
      { error: 'There exists no competition with that code' },
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }

  try {
    const { email }: RemoveInterestedPersonRequest = await req.json();

    try {
      await prisma.interestedPerson.delete({
        where: {
          compCode_email: {
            competitionCode: code,
            email,
          },
        },
      });

      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json(
        { error: 'Failed to remove from interested' },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'You must specify an `email`' },
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
}
