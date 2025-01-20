'use server';

import prisma from '@/prisma';
import { Redeemable } from '@prisma/client';
import { UpdateRedeemable } from '@/types/redeemable';
import {
  createRedeemableSchema,
  getRedeemableSchema,
} from '@/schemas/redeemable';
import { GetRedeemableOptions } from '@/types/redeemable';

export async function getRedeemables(options: GetRedeemableOptions) {
  await getRedeemableSchema.validate(options);
  return await prisma.redeemable.findMany({
    take: options.limit,
    skip: options.cursor ? 1 : 0,
    cursor: options.cursor ? { createdAt: options.cursor } : undefined,
    orderBy: {
      name: options.sort,
    },
    where: {
      competitionCode: options.competitionCode ?? undefined,
      name: options.name ?? undefined,
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

  return true;
}

export async function updateRedeemable(schema: UpdateRedeemable) {
  await createRedeemableSchema.validate(schema);
  await prisma.redeemable.update({
    where: {
      competitionCode_name: {
        competitionCode: schema.old.competitionCode,
        name: schema.old.name,
      },
    },
    data: {
      ...schema.new,
    },
  });
}

export async function deleteRedeemable(schema: Redeemable) {
  await createRedeemableSchema.validate(schema);
  await prisma.redeemable.delete({
    where: {
      competitionCode_name: {
        competitionCode: schema.competitionCode,
        name: schema.name,
      },
    },
  });
}
