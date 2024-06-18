import { Attendee } from '@prisma/client';

export enum CheckType {
  Automated,
  Manual,
  Info,

  Dependent,
}

export interface CompletableCheck {
  name: string;
  type: CheckType.Automated;
  complete: boolean;
  required: boolean;
}

export interface NonCompleteableCheck {
  name: string;
  type: CheckType.Manual | CheckType.Info;
  required: boolean;
}

export type SingleCheck = CompletableCheck | NonCompleteableCheck;

export interface MultipleCheck {
  name: string;
  type: CheckType.Dependent;
  dependsOn: SingleCheck[];
}

export type Check = SingleCheck | MultipleCheck;

export interface CheckInSuccess {
  attendee: Attendee;
  idempotent?: true;
}

export interface CheckInFailure {
  checks?: Check[];
  error: string;
}

export type CheckInResponse = CheckInSuccess | CheckInFailure;
