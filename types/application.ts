import { Attendee, User } from '@prisma/client';

export type AttendeeWithUser = Attendee & { user: User };
export type GetAttendeesResponse = Attendee & {
  user?: User;
};

export type GetAttendeesOptions = {
  user?: boolean;
};
