import { Transaction } from '@prisma/client';
import { Redeemable } from '@prisma/client';

export type GenericResponse = {
  status: number;
  statusText?: string;
  data: any;
};

export type CreateRedeemableResponse = GenericResponse;
export type UpdateRedeemableResponse = GenericResponse;
export type GetRedeemableResponse = GenericResponse;
export type CreateTransactionResponse = Omit<GenericResponse, 'data'>;
export type DeleteRedeemableResponse = Omit<GenericResponse, 'data'>;
