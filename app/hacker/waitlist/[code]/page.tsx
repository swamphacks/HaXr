import {
  competitionWithApplicationStatusAggregator,
  getApplication,
} from '@/actions/applications';
import { auth } from '@/auth';
import WaitlistDashboard from '@/components/waitlist/WaitlistDashboard';
import { redirect } from 'next/navigation';

export default async function WaitlistPage({
  params: { code },
}: {
  params: { code: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect('/');

  // Fetch competition data, application count, and user's application status
  const { competition, statusCounts } =
    await competitionWithApplicationStatusAggregator(code);
  const userApp = await getApplication(code, session.user.id);

  return (
    <WaitlistDashboard
      competition={competition}
      statusCounts={statusCounts}
      userApplication={userApp}
    />
  );
}
