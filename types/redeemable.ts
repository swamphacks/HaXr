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
