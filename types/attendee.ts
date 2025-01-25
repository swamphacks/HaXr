import { Attendee, User } from '@prisma/client';

export interface AttendeeWithUser extends Attendee {
  user: User;
}
