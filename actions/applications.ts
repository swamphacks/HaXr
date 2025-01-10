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

/**
 * @description Get the application stats for a competition
 *
 * @param code : string - The competition code you want to aggregate stats for
 * @returns Record<Status, number> - A record of status counts for the competition
 */
export const getCompetitionApplicationStats = async (
  code: string
): Promise<Record<Status, number>> => {
  // Group by status then count status field
  const statusCounts = await prisma.application.groupBy({
    by: ['status'],
    where: {
      competitionCode: code,
    },
    _count: {
      status: true,
    },
  });

  // Defaultdict of all statuses to 0
  const result = {} as Record<Status, number>;
  for (const status of Object.values(Status)) {
    result[status] = 0;
  }

  // Fill in the counts
  for (const { status, _count } of statusCounts) {
    result[status] = _count.status;
  }

  return result;
};

interface UpdateWaitlistStatusResponse {
  application: Application | null;
  error: string | null;
}

// These are all statuses that should be allowed to run this action
const eligableStatuses: Status[] = [Status.ACCEPTED, Status.WAITLISTED];

/**
 * Updating waitlist status for a user, checks against constant MAX_SEAT_CAPACITY
 */
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

  if (!eligableStatuses.includes(application.status)) {
    return {
      application: null,
      error:
        "You can't register for this compeition right now. Refresh the page and try again.",
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
