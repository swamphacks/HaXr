'use server';

import prisma from '@/prisma';
import { Redeemable, Prisma } from '@prisma/client';
import {
  UpdateRedeemableBody,
  InsufficientFundsError,
} from '@/types/redeemable';
import {
  createRedeemableSchema,
  getRedeemableSchema,
  updateRedeemableSchema,
  createTransactionSchema,
} from '@/schemas/redeemable';
import { GetRedeemableOptions, TransactionInfo } from '@/types/redeemable';

export async function getRedeemable(code: string, name: string) {
  return await prisma.redeemable.findUniqueOrThrow({
    where: {
      competitionCode_name: {
        competitionCode: code,
        name: name,
      },
    },
  });
}

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

export async function createTransaction(
  competitionCode: string,
  redeemableName: string,
  info: TransactionInfo
) {
  const vInfo = await createTransactionSchema.validate(info);

  // Giving user a redeemable
  if (info.quantity > 0) {
    await prisma.transaction.create({
      data: {
        ...vInfo,
      },
    });
    return;
  }

  // User is redeeming a redeemable - use db transactions
  await prisma.$transaction(async (tx) => {
    // Calculate user balance
    const balance = await tx.transaction.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        competitionCode: vInfo.competitionCode,
        userId: vInfo.userId,
        redeemableName: vInfo.redeemableName,
      },
    });

    if ((balance._sum.quantity ?? 0) + info.quantity < 0) {
      throw new InsufficientFundsError(
        'Cannot redeem redeemable due to insufficient funds'
      );
    }

    await tx.transaction.create({
      data: {
        ...info,
      },
    });
  });
}
