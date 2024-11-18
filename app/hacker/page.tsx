import { getCompetitionsWithApplications } from '@/actions/applications';
import { auth } from '@/auth';
import HackerDashboard from '@/components/hacker/HackerDashboard';
import { redirect } from 'next/navigation';

export default async function HackerDashboardPage() {
  const session = await auth();
  if (!session || !session.user) redirect('/');

  return (
    <HackerDashboard
      session={session}
      compsWithApps={await getCompetitionsWithApplications(session.user.id!)}
    />
  );
}
