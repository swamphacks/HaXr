'use server';

import prisma from '@/prisma';
import { Redeemable, Prisma } from '@prisma/client';
import { UpdateRedeemableBody } from '@/types/redeemable';
import {
  createRedeemableSchema,
  getRedeemableSchema,
  updateRedeemableSchema,
} from '@/schemas/redeemable';
import { GetRedeemableOptions } from '@/types/redeemable';

export async function getRedeemables(options: GetRedeemableOptions) {
  const validatedOptions = await getRedeemableSchema.validate(options);
  console.log(validatedOptions);

  const canSkip =
    !!validatedOptions.cursor &&
    !!validatedOptions.cursor.name &&
    !!validatedOptions.cursor.name;
  return await prisma.redeemable.findMany({
    take: validatedOptions.limit,
    skip: canSkip ? 1 : 0,
    cursor: canSkip
      ? {
          competitionCode_name: {
            // only way i could get ts to not complain - canSkip is true if both cursor values are defined
            competitionCode: validatedOptions!.cursor!.competitionCode ?? '',
            name: validatedOptions!.cursor!.name ?? '',
          },
        }
      : undefined,
    orderBy: {
      name: validatedOptions.sort as Prisma.SortOrder,
    },
    where: {
      competitionCode: validatedOptions.competitionCode,
      name: validatedOptions.name,
    },
  });
}

export async function createRedeemable(schema: Redeemable) {
  await createRedeemableSchema.validate(schema);
  await prisma.redeemable.create({
    data: {
      ...schema,
    },
  });
}

export async function updateRedeemable(
  compCode: string,
  name: string,
  schema: UpdateRedeemableBody
) {
  const vSchema = await updateRedeemableSchema.validate(schema);
  await prisma.redeemable.update({
    where: {
      competitionCode_name: {
        competitionCode: compCode,
        name: name,
      },
    },
    data: {
      ...vSchema,
    },
  });
}

export async function deleteRedeemable(competitionCode: string, name: string) {
  await prisma.redeemable.delete({
    where: {
      competitionCode_name: {
        competitionCode: competitionCode,
        name: name,
      },
    },
  });
}
