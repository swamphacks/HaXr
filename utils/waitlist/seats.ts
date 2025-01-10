import { Competition, Status } from '@prisma/client';

export const getSeatsRemaining = (
  competition: Competition,
  statusCounts: Record<Status, number>
) => {
  if (!competition.max_attendees) return 0;

  return competition.max_attendees - (statusCounts.ATTENDING ?? 0);
};
