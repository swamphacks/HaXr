'use server';

import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import {
  TransactionInfo,
  GetTransactionOptions,
  InsufficientFundsError,
} from '@/types/redeemable';
import {
  createTransactionSchema,
  getTransactionSchema,
} from '@/schemas/transaction';

export async function createTransaction(transctionInfo: TransactionInfo) {
  const info = await createTransactionSchema.validate(transctionInfo);

  // Giving user a redeemable
  if (info.quantity > 0) {
    await prisma.transaction.create({
      data: {
        ...info,
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
        competitionCode: info.competitionCode,
        userId: info.userId,
        redeemableName: info.redeemableName,
      },
    });

    if ((balance._sum.quantity ?? 0) + info.quantity < 0)
      throw new InsufficientFundsError(
        'Cannot redeem redeemable due to insufficient funds'
      );

    await tx.transaction.create({
      data: {
        ...info,
      },
    });
  });
}

export async function getTransactions(options: GetTransactionOptions) {
  const validated = await getTransactionSchema.validate(options);

  return await prisma.transaction.findMany({
    take: validated.limit,
    skip: validated.cursor ? 1 : 0,
    cursor: validated.cursor ? { id: options.cursor } : undefined,
    orderBy: {
      transactedAt: validated.sort as Prisma.SortOrder,
    },
    where: {
      competitionCode: options.competitionCode,
      userId: options.userId,
      redeemableName: options.redeemableName,
    },
  });
}

export async function getTransaction(id: string) {
  return await prisma.transaction.findUniqueOrThrow({
    where: {
      id,
    },
  });
}
