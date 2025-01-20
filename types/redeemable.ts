import { Redeemable } from '@prisma/client';

export type UpdateRedeemable = {
  old: Redeemable;
  new: Redeemable;
};

export type RedeemableSort = 'asc' | 'desc';

export type GetRedeemableOptions = {
  competitionCode?: string;
  name?: string;
  limit?: number;
  cursor?: string;
  sort?: RedeemableSort;
};
