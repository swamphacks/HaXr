'use server';

import { Application, Attendee, Status, User } from '@prisma/client';
import prisma from '@/prisma';
import { Check, CheckInResponse, CheckType } from '@/types/scanning';

export async function getUser(userId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id: userId } });
}

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

export async function getCheckInChecks(
  competitionCode: string,
  userId: string
): Promise<Check[] | null> {
  const application = await getApplication(competitionCode, userId);

  if (application) {
    return [
      {
        name: 'Is an accepted applicant',
        type: CheckType.Automated,
        complete:
          application.status === Status.ACCEPTED ||
          application.status === Status.ATTENDING,
        required: true,
      },
      {
        name: 'Has completed necessary forms', // TODO: integrate with forms
        type: CheckType.Dependent,
        dependsOn: [
          {
            name: 'Photo release',
            type: CheckType.Automated,
            complete: true,
            required: true,
          },
          {
            name: 'Some optional form',
            type: CheckType.Automated,
            complete: false,
            required: false,
          },
        ],
      },
      {
        name: "Student's ID matches information above",
        type: CheckType.Manual,
        required: true,
      },
    ];
  }
  return null;
}

export async function checkIn(
  competitionCode: string,
  userId: string
): Promise<CheckInResponse> {
  // Check if already checked-in
  const checkedInAttendee = await getAttendee(competitionCode, userId);
  if (checkedInAttendee) {
    return {
      attendee: checkedInAttendee,
      idempotent: true,
    };
  }

  // Find application
  const application = await getApplication(competitionCode, userId);
  if (!application) {
    return {
      error: 'Application does not exist for this user',
    };
  }

  // Verify applicant completed all automated checks
  const checks = await getCheckInChecks(competitionCode, userId);
  if (!checks) return { error: "Couldn't get checks for applicant" };
  if (
    checks
      .flatMap((c) => (c.type === CheckType.Dependent ? c.dependsOn : c))
      .filter((c) => c.type === CheckType.Automated)
      .some((c) => !('complete' in c && c.required ? c.complete : true))
  ) {
    return {
      checks,
      error: 'Not all automated checks are complete',
    };
  }
  // Register attendee
  try {
    const attendee = await prisma.attendee.create({
      data: {
        competitionCode,
        userId,
        applicationId: application.id,
      },
    });

    return {
      attendee,
    };
  } catch {
    return {
      error:
        'Encountered error checking in applicant (they may already be checked in)',
    };
  }
}
