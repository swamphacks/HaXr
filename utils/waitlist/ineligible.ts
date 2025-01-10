import { Status } from '@prisma/client';

export const getIneligibleReason = (status?: Status): string => {
  if (!status) return 'You have not applied to this competition.';
  if (status === 'REJECTED')
    return 'You have been rejected from this competition.';
  if (status === 'STARTED')
    return 'You have started your application but have not completed it.';
  if (status === 'NOT_ATTENDING')
    return 'You have declined your invitation to this competition.';
  if (status === 'APPLIED')
    return 'You have applied to this competition but no decision has been made by us yet.';
  if (status === 'ACCEPTED')
    return 'You did not confirm your attendance in time. Therefore, you have forfeited your spot to the waitlist.';
  return 'Something went wrong with your application. Please contact us on Discord or at support@swamphacks.com';
};
