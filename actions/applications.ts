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
import {
  eligableStatuses,
  PromoteError,
  PromoteFromWaitlistResponse,
  WaitlistErrorResponse,
} from '@/types/waitlist';

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

/**
 * Updating waitlist status for a user, checks against constant MAX_SEAT_CAPACITY
 */
export const promoteFromWaitlist = async (
  appId: string
): Promise<PromoteFromWaitlistResponse> => {
  return prisma.$transaction(async (tx) => {
    const application = await tx.application.findUnique({
      where: {
        id: appId,
      },
      include: {
        competition: true,
      },
    });

    // Check for existance and eligibility application and competition
    if (!application) {
      return {
        status: 'error',
        error: PromoteError.APPLICATION_NOT_FOUND,
      } as WaitlistErrorResponse;
    }

    if (!application.competition) {
      return {
        status: 'error',
        error: PromoteError.COMPETITION_NOT_FOUND,
      } as WaitlistErrorResponse;
    }

    if (!eligableStatuses.includes(application.status)) {
      return {
        status: 'error',
        error: PromoteError.INVALID_STATUS,
      } as WaitlistErrorResponse;
    }

    // Check competition timing constraints
    const currentDate = new Date();

    if (application.competition.confirm_by > currentDate) {
      return {
        status: 'error',
        error: PromoteError.BEFORE_CONFIRMATION_DEADLINE,
      } as WaitlistErrorResponse;
    }

    if (application.competition.start_date < currentDate) {
      return {
        status: 'error',
        error: PromoteError.AFTER_COMPETITION_START,
      } as WaitlistErrorResponse;
    }

    // Check if the competition MAX_SEAT_CAPACITY has been reached
    const attendeeCount = await tx.application.count({
      where: {
        competitionCode: application.competition.code,
        status: Status.ATTENDING,
      },
    });

    if (attendeeCount >= MAX_SEAT_CAPACITY) {
      return {
        status: 'error',
        error: PromoteError.MAX_CAPACITY_REACHED,
      } as WaitlistErrorResponse;
    }

    // Update application status
    const updatedApplication = await tx.application.update({
      where: {
        id: appId,
      },
      data: {
        status: Status.ATTENDING,
      },
    });

    // Return success response
    return {
      status: 'success',
      updatedApplication,
    };
  });
};
