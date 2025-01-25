import { Event } from '@prisma/client';

export interface EventWithInfo extends Event {
  numAttendees: number;
}
