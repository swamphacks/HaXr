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
import { MAX_SEAT_CAPACITY } from '@/constants/attendance';

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

export const confirmAttendance = async (appId: string, attending: boolean) => {
  return prisma.application.update({
    where: {
      id: appId,
      status: Status.ACCEPTED, // prevent changing status if not accepted
    },
    data: {
      status: attending ? Status.ATTENDING : Status.NOT_ATTENDING,
    },
  });
};

interface CompetitionWithApplicationStatusAggResponse {
  competition: Competition;
  statusCounts: Record<Status, number>;
}

export const competitionWithApplicationStatusAggregator = async (
  code: string
): Promise<CompetitionWithApplicationStatusAggResponse> => {
  const competition = await prisma.competition.findUnique({
    where: {
      code,
    },
  });

  if (!competition) {
    throw new Error('Competition not found');
  }

  const applications = await prisma.application.findMany({
    where: {
      competitionCode: code,
    },
  });

  const statusCounts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<Status, number>
  );

  return {
    competition,
    statusCounts,
  };
};

/**
 * Updating waitlist status for a user, checks against constant MAX_SEAT_CAPACITY
 */

interface UpdateWaitlistStatusResponse {
  application: Application | null;
  error: string | null;
}

export const updateWaitlistStatusAttending = async (
  competitionCode: string,
  appId: string
): Promise<UpdateWaitlistStatusResponse> => {
  // Make sure competition acceptances have closed

  const competition = await prisma.competition.findUnique({
    where: {
      code: competitionCode,
    },
  });

  if (!competition) {
    return {
      application: null,
      error: 'Competition not found. Please try again later.',
    };
  }

  if (competition.confirm_by > new Date()) {
    return {
      application: null,
      error: 'Waitlist is not open yet. Please try again later.',
    };
  }

  const application = await prisma.application.findUnique({
    where: {
      id: appId,
    },
  });

  if (!application) {
    return {
      application: null,
      error: 'Application not found. Please try again later.',
    };
  }

  const attendingCount = await prisma.application.count({
    where: {
      competitionCode,
      status: Status.ATTENDING,
    },
  });

  if (attendingCount >= MAX_SEAT_CAPACITY) {
    return {
      application: null,
      error: 'No seats available. Refresh the page to update the seat count.',
    };
  }

  const updatedApp = await prisma.application.update({
    where: {
      id: appId,
    },
    data: {
      status: Status.ATTENDING,
    },
  });

  return {
    application: updatedApp,
    error: null,
  };
};
