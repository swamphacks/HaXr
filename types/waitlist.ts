import { Application, Status } from '@prisma/client';

// These are all statuses that should be allowed to run this action
export const eligableStatuses: Status[] = [Status.WAITLISTED];

export enum PromoteError {
  INVALID_STATUS = 'INVALID_STATUS',
  MAX_CAPACITY_REACHED = 'MAX_CAPACITY_REACHED',
  APPLICATION_NOT_FOUND = 'APPLICATION_NOT_FOUND',
  COMPETITION_NOT_FOUND = 'COMPETITION_NOT_FOUND',
  BEFORE_CONFIRMATION_DEADLINE = 'BEFORE_CONFIRMATION_DEADLINE',
  AFTER_COMPETITION_START = 'AFTER_COMPETITION_START',
  BEFORE_WAITLIST_OPEN = 'BEFORE_WAITLIST_OPEN',
  AFTER_WAITLIST_CLOSE = 'AFTER_WAITLIST_CLOSE',
}

export type WaitlistSuccessResponse = {
  status: 'success';
  updatedApplication: Application;
};

export type WaitlistErrorResponse = {
  status: 'error';
  error: PromoteError;
};

export type PromoteFromWaitlistResponse =
  | WaitlistSuccessResponse
  | WaitlistErrorResponse;
