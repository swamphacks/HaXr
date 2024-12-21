'use server';

import prisma from '@/prisma';
import { Competition, Status } from '@prisma/client';
import { competitionConfigurationSchema } from '@/schemas/admin';

export async function getCompetitions(): Promise<Competition[]> {
  return prisma.competition.findMany({
    orderBy: {
      start_date: 'desc', // Most recent first
    },
  });
}

export interface CompetitionWithStats extends Competition {
  stats: {
    remaining: number;
    total: number;
  };
}

export async function getCompetitionsWithStats(): Promise<
  CompetitionWithStats[]
> {
  const toReview = await prisma.application.groupBy({
    by: ['competitionCode'],
    _count: {
      _all: true,
    },
    where: {
      status: Status.APPLIED,
    },
  });
  const totals = await prisma.application.groupBy({
    by: ['competitionCode'],
    _count: {
      _all: true,
    },
  });

  return getCompetitions().then((comps) =>
    Promise.all(
      comps.map(async (c) => {
        const remaining = toReview.find((a) => a.competitionCode === c.code)!
            ._count._all,
          total = totals.find((a) => a.competitionCode === c.code)!._count._all;

        return {
          ...c,
          stats: { remaining, total },
        };
      })
    )
  );
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
