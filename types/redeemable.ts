import { Transaction } from '@prisma/client';

export type GetRedeemableOptionsCursor = {
  competitionCode?: string;
  name?: string;
};

export type GetRedeemableOptions = {
  competitionCode?: string;
  name?: string;
  limit?: number;
  sort?: string;
  cursor?: GetRedeemableOptionsCursor;
};

export type UpdateRedeemableBody = {
  name?: string;
  competitionCode?: string;
  description?: string | null;
};

export type TransactionInfo = Omit<Transaction, 'id' | 'transactedAt'>;

export type GetTransactionOptions = {
  limit?: number;
  cursor?: string;
  sort?: string;
  competitionCode?: string;
  userId?: string;
  redeemableName?: string;
};

export class InsufficientFundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientFundsError';
    Object.setPrototypeOf(this, InsufficientFundsError.prototype);
  }
}
