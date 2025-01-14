export enum PromoteError {
  NOT_ON_WAITLIST,
  MAX_CAPACITY_REACHED,
  APPLICATION_NOT_FOUND,
  BEFORE_WAITLIST_OPEN,
  AFTER_WAITLIST_CLOSE,
}

export type WaitlistSuccessResponse = {
  status: 'success';
};

export type WaitlistErrorResponse = {
  status: 'error';
  error: PromoteError;
};

export type PromoteFromWaitlistResponse =
  | WaitlistSuccessResponse
  | WaitlistErrorResponse;
