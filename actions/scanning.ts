'use server';

import { Application, Attendee, Status, User } from '@prisma/client';
import prisma from '@/prisma';
import {
  Check,
  CheckInResponse,
  CheckOutResponse,
  CheckType,
} from '@/types/scanning';
import { getApplication, getAttendee } from '@/actions/applications';

export async function getUser(userId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getCheckInApplicants(
  competitionCode: string
): Promise<(Application & { user: User; attendee: Attendee | null })[]> {
  return await prisma.application.findMany({
    where: {
      competitionCode,
    },
    include: {
      user: true,
      attendee: true,
    },
  });
}

export async function getCheckInChecks(
  applicationId: string
): Promise<Check[] | null> {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (application) {
    return [
      {
        name: 'Is an accepted/ applicant',
        type: CheckType.Automated,
        complete:
          application.status === Status.ACCEPTED ||
          application.status === Status.ATTENDING,
        required: true,
      },
      {
        name: 'Has completed necessary forms',
        type: CheckType.Dependent,
        dependsOn: [
          {
            // TODO: make this automated
            name: 'Participation Form',
            type: CheckType.Manual,
            required: true,
          },
        ],
      },
      {
        name: 'Has a valid form of identification (e.g. student ID)',
        type: CheckType.Manual,
        required: true,
      },
      {
        name: 'Student should join the Discord server and link their accounts',
        type: CheckType.Info,
        required: true,
      },
    ];
  }
  console.error('No application found with applicationId ' + applicationId);
  return null;
}

export async function checkIn(
  applicationId: string,
  badgeId?: string
): Promise<CheckInResponse> {
  // Check if already checked-in
  const checkedInAttendee = await getAttendee(applicationId);
  if (checkedInAttendee) {
    // Update badge ID if provided
    if (badgeId && checkedInAttendee.badgeId !== badgeId) {
      try {
        const updated = await prisma.attendee.update({
          where: { applicationId },
          data: { badgeId },
        });

        return { attendee: updated, idempotent: true };
      } catch {
        return {
          error: 'Encountered error updating badge ID',
        };
      }
    } else {
      // Aleady checked in, nothing to do
      return {
        attendee: checkedInAttendee,
        idempotent: true,
      };
    }
  }

  // Find application
  const application = await getApplication(applicationId);
  if (!application) {
    return {
      error: 'Application does not exist.',
    };
  }

  // Verify applicant completed all automated checks
  const checks = await getCheckInChecks(application.id);
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
        competitionCode: application.competitionCode,
        applicationId: application.id,
        userId: application.userId,

        badgeId, // Optional
      },
    });

    return {
      attendee,
    };
  } catch {
    return {
      error:
        'Encountered error checking in applicant (they may already be checked in or that badge may already be in use)',
    };
  }
}

export async function checkOut(
  applicationId: string
): Promise<CheckOutResponse> {
  try {
    await prisma.attendee.delete({
      where: { applicationId },
    });

    return { ok: true };
  } catch {
    return {
      ok: false,
      error:
        'Encountered error checking out applicant. It may be that they are not checked in.',
    };
  }
}
