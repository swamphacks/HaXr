import {
  getApplication,
  getCompetitionApplicationStats,
} from '@/actions/applications';
import { getCompetition } from '@/actions/competition';
import { auth } from '@/auth';
import WaitlistDashboard from '@/components/waitlist/WaitlistDashboard';
import { notFound, redirect } from 'next/navigation';

export default async function WaitlistPage({
  params: { code },
}: {
  params: { code: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect('/');

  // Fetch competition data, application count, and user's application status
  const competition = await getCompetition(code);
  const statusCounts = await getCompetitionApplicationStats(code);
  const userApp = await getApplication(code, session.user.id);

  // If competition doesn't exist, return 404
  if (!competition) notFound();

  return (
    <WaitlistDashboard
      competition={competition}
      statusCounts={statusCounts}
      userApplication={userApp}
    />
  );
}
