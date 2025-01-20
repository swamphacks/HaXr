import { Transaction } from '@prisma/client';

export type TransactionInfo = Omit<Transaction, 'id' | 'transactedAt'>;

export type TransactionSort = 'asc' | 'desc';

export type GetTransactionOptions = {
  limit?: number;
  cursor?: string;
  sort?: TransactionSort;
  competitionCode?: string;
  userId?: string;
  redeemableName?: string;
};
