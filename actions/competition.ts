'use server';

import prisma from '@/prisma';
import { Competition } from '@prisma/client';
import { competitionConfigurationSchema } from '@/schemas';

export async function updateCompetitionConfig(
  code: string,
  config: Competition
) {
  if (await competitionConfigurationSchema.isValid(config))
    try {
      await prisma.competition.update({
        where: {
          code: code,
        },
        data: { ...config, code }, // Persist code
      });

      return true;
    } catch {}

  return false;
}
