'use server';

import prisma from '@/prisma';
import { TransactionInfo, GetTransactionOptions } from '@/types/transaction';
import {
  createTransactionSchema,
  getTransactionSchema,
} from '@/schemas/transaction';

export async function createTransaction(transctionInfo: TransactionInfo) {
  await createTransactionSchema.validate(transctionInfo);
  await prisma.transaction.create({
    data: {
      ...transctionInfo,
    },
  });
}

export async function getTransactions(options: GetTransactionOptions) {
  await getTransactionSchema.validate(options);

  return await prisma.transaction.findMany({
    take: options.limit,
    skip: options.cursor ? 1 : 0,
    cursor: options.cursor ? { id: options.cursor } : undefined,
    orderBy: {
      transactedAt: options.sort,
    },
    where: {
      competitionCode: options.competitionCode ?? undefined,
      userId: options.userId ?? undefined,
      redeemableName: options.redeemableName ?? undefined,
    },
  });
}
