import { Transaction } from '@prisma/client';
import { Redeemable } from '@prisma/client';

export type CreateRedeemableResponse = {
	status: number;
	statusText?: string;
	data: Redeemable | null;
};

export type UpdateRedeemableResponse = CreateRedeemableResponse;

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

export type CreateRedeemableBody = Omit<
	Redeemable,
	'createdAt' | 'description'
> &
	Partial<Pick<Redeemable, 'description'>>;
export type UpdateRedeemableBody = Partial<Omit<Redeemable, 'createdAt'>>;
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
