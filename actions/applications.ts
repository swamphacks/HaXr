'use server';
import {
  Application,
  Attendee,
  Competition,
  Status,
  User,
} from '@prisma/client';
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

export interface CompetitionWithApplication extends Competition {
  applications: undefined;
  application: Application | null;
}

export async function getCompetitionsWithApplications(
  userId: string
): Promise<CompetitionWithApplication[]> {
  return prisma.competition
    .findMany({
      include: {
        applications: {
          where: {
            userId,
          },
        },
      },
    })
    .then((compWithApp) =>
      compWithApp.map((comp) => ({
        ...comp,
        applications: undefined,
        application: comp.applications.at(0) ?? null,
      }))
    );
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

export const setApplicationStatus = async (appId: string, status: Status) => {
  return prisma.application.update({
    where: {
      id: appId,
    },
    data: {
      status,
    },
  });
};
