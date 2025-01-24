'use server';
import prisma from '@/prisma';
import { User } from '@prisma/client';

type Result = 'success' | 'error';

type SuccessResponse = {
  roles: string[];
  result: 'success';
};

type ErrorResponse = {
  error: string;
  result: 'error';
};

type Response = SuccessResponse | ErrorResponse;

export const getUserCompetitionRoles = async (
  snowflake: string
): Promise<Response> => {
  const user = await prisma.user.findUnique({
    where: {
      discordId: snowflake,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return {
      error: 'User has not connected Discord account',
      result: 'error',
    };
  }

  const compsWithRoleIds = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      attendees: {
        select: {
          competition: {
            select: {
              attendeeDiscordRoleId: true,
            },
          },
        },
      },
    },
  });

  // Filter out null values from the discordRoleIds array
  const discordRoleIds = compsWithRoleIds?.attendees
    .map((attendee) => attendee.competition.attendeeDiscordRoleId)
    .filter((roleId) => roleId != null) as string[];

  return {
    roles: discordRoleIds,
    result: 'success',
  };
};
