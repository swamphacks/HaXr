import { getCompetition } from '@/actions/competition';
import { redirect } from 'next/navigation';

export default async function ApplicationLayout({
  children,
  params: { code },
}: {
  children: React.ReactNode;
  params: { code: string };
}) {
  const competition = await getCompetition(code);

  // Redirect if competition doesn't exist or if the application deadline has passed
  if (!competition || new Date() > competition.apply_close) redirect('/hacker');

  return children;
}
