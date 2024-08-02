'use server';

import prisma from '@/prisma';
import { Competition } from '@prisma/client';
import { competitionConfigurationSchema } from '@/schemas';

export async function getCompetitions(): Promise<Competition[]> {
  return prisma.competition.findMany({
    orderBy: {
      start_date: 'desc', // Most recent first
    },
  });
}

export async function getCompetition(
  code: string
): Promise<Competition | null> {
  return prisma.competition.findUnique({
    where: { code },
  });
}

export async function updateCompetitionConfig(
  code: string,
  config: Competition
) {
  if (await competitionConfigurationSchema.isValid(config)) {
    try {
      await prisma.competition.update({
        where: {
          code: code,
        },
        data: { ...config, code }, // Persist code
      });

      return true;
    } catch {}
  }

  return false;
}
