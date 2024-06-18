'use server';
import { Application, Attendee, User } from '@prisma/client';
import prisma from '@/prisma';

export async function getApplication(
  competitionCode: string,
  userId: string
): Promise<Application | null> {
  return prisma.application.findUnique({
    where: {
      compCode_userId: {
        competitionCode,
        userId,
      },
    },
  });
}

export async function getApplicants(
  competitionCode: string
): Promise<(Application & { user: User })[]> {
  return prisma.application.findMany({
    include: {
      user: true,
    },
    where: {
      competitionCode,
    },
  });
}

export async function getAttendee(
  competitionCode: string,
  userId: string
): Promise<Attendee | null> {
  return prisma.attendee.findUnique({
    where: {
      compCode_userId: {
        competitionCode,
        userId,
      },
    },
  });
}
