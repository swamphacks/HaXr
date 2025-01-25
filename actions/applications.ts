'use server';
import {
  Application,
  Attendee,
  Competition,
  Status,
  User,
} from '@prisma/client';
import { ValidationError } from 'yup';
import prisma from '@/prisma';
import { HackerApplicationFormValues } from '@/app/hacker/application/[code]/page';
import { PromoteError, PromoteFromWaitlistResponse } from '@/types/waitlist';
import { AttendeeWithUser, GetAttendeesOptions } from '@/types/application';
import { getAttendeeOptionsSchema } from '@/schemas/application';
import { GenericResponse } from '@/types/responses';

export async function getApplication(
  applicationId: string
): Promise<Application | null> {
  return prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });
}

export async function getApplicationByUser(
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
  applicationId: string
): Promise<Attendee | null> {
  return prisma.attendee.findUnique({
    where: {
      applicationId,
    },
  });
}

export async function getAttendeeByBadgeId(
  badgeId: string,
  code?: string
): Promise<AttendeeWithUser | null> {
  return prisma.attendee.findUnique({
    where: {
      badgeId,
      competitionCode: code,
    },
    include: {
      user: true,
    },
  });
}

export async function getAttendees(
  competitionCode: string,
  options?: GetAttendeesOptions
): Promise<GenericResponse> {
  try {
    const vOptions = await getAttendeeOptionsSchema.validate(options ?? {});
    const resp = await prisma.attendee.findMany({
      include: {
        ...vOptions,
      },
      where: {
        competitionCode,
      },
    });
    return { status: 200, data: resp };
  } catch (e) {
    if (e instanceof ValidationError)
      return { status: 400, statusText: e.message, data: null };

    throw e;
  }
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
  // Note: not all statuses may be present in the result
  const statusCounts = await prisma.application.groupBy({
    by: ['status'],
    where: {
      competitionCode: code,
    },
    _count: {
      status: true,
    },
  });

  const result = Object.fromEntries(
    Object.values(Status).map((status) => [
      status,
      statusCounts.find((s) => s.status === status)?._count.status ?? 0,
    ])
  ) as Record<Status, number>;

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

    // Check that the application exists
    if (!application) {
      return {
        status: 'error',
        error: PromoteError.APPLICATION_NOT_FOUND,
      };
    }
    const {
      status,
      competition: { code, waitlist_open, waitlist_close, max_attendees },
    } = application;

    // (start fetching attending count)
    const promiseAttendingCount = tx.application.count({
      where: {
        competitionCode: code,
        status: Status.ATTENDING,
      },
    });

    // ... and that they're on the waitlist
    if (status !== Status.WAITLISTED) {
      return {
        status: 'error',
        error: PromoteError.NOT_ON_WAITLIST,
      };
    }

    // ... and we're taking people off the waitlist at this time
    const now = new Date();
    if (waitlist_open && now < waitlist_open) {
      return {
        status: 'error',
        error: PromoteError.BEFORE_WAITLIST_OPEN,
      };
    } else if (waitlist_close && waitlist_close < now) {
      return {
        status: 'error',
        error: PromoteError.AFTER_WAITLIST_CLOSE,
      };
    }

    // ... and there's a spot for them
    const attendingCount = await promiseAttendingCount;
    if (max_attendees !== null && attendingCount >= max_attendees) {
      return {
        status: 'error',
        error: PromoteError.MAX_CAPACITY_REACHED,
      };
    }

    // Update application status
    await tx.application.update({
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
    };
  });
};

export async function markFormsAsCompleted(
  applicationIds: string[]
): Promise<boolean> {
  try {
    await prisma.application.updateMany({
      where: {
        id: {
          in: applicationIds,
        },
      },
      data: {
        completedForm: true,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
