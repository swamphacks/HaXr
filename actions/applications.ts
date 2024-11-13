'use server';
import { Application, Attendee, Status, User } from '@prisma/client';
import prisma from '@/prisma';
import { HackerApplicationFormValues } from '@/app/hacker/application/[code]/page';

export async function getApplication(
  competitionCode: string,
  userId: string
): Promise<Application | null> {
  return prisma.application.findUnique({
    where: {
      competitionCode_userId: {
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

export const createApplication = async (
  values: HackerApplicationFormValues,
  userId: string,
  competitionCode: string
) => {
  try {
    const application = await prisma.application.create({
      data: {
        competitionCode,
        userId,
        content: { ...values },
      },
    });

    return application;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating application');
  }
};

export const setApplicationStatus = async (
  userId: string,
  competitionCode: string,
  status: Status
) => {
  return prisma.application.update({
    where: {
      competitionCode_userId: {
        competitionCode,
        userId,
      },
    },
    data: {
      status,
    },
  });
};
