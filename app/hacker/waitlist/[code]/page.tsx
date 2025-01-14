import {
  getApplication,
  getCompetitionApplicationStats,
} from '@/actions/applications';
import { getCompetition } from '@/actions/competition';
import { auth } from '@/auth';
import WaitlistDashboard from '@/components/waitlist/WaitlistDashboard';
import { Competition, Status } from '@prisma/client';
import { redirect } from 'next/navigation';

export interface CompetitionWithWaitlist extends Competition {
  waitlist_open: Date;
}

export default async function WaitlistPage({
  params: { code },
}: {
  params: { code: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect('/');

  // Fetch competition data and competition application stats
  const competition = await getCompetition(code);
  if (!competition || !competition.waitlist_open) redirect('/hacker');
  const competitionWithWaitlist = competition as CompetitionWithWaitlist;

  const statusCounts = await getCompetitionApplicationStats(code);

  // Fetch user application
  const userApp = await getApplication(code, session.user.id);
  if (!userApp || userApp.status !== Status.WAITLISTED) redirect('/hacker');

  return (
    <WaitlistDashboard
      competition={competitionWithWaitlist}
      statusCounts={statusCounts}
      userApplication={userApp}
    />
  );
}
