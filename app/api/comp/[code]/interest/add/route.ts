import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
import { StatusCodes } from 'http-status-codes';

export interface AddInterestedPersonRequest {
  name: string;
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
    const { name, email }: AddInterestedPersonRequest = await req.json();

    try {
      const { id } = await prisma.interestedPerson.upsert({
        select: { id: true },
        where: {
          compCode_email: {
            competitionCode: code,
            email,
          },
        },
        update: {
          name,
        },
        create: {
          competitionCode: code,
          email,
          name,
        },
      });

      return NextResponse.json({ id });
    } catch {
      return NextResponse.json(
        { error: 'Failed to mark as interested' },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'You must specify a `name` and `email`' },
      {
        status: StatusCodes.BAD_REQUEST,
      }
    );
  }
}
