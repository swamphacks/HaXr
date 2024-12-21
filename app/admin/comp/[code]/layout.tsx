import React, { PropsWithChildren } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { auth } from '@/auth';
import {
  getCompetitions,
  getCompetitionsWithStats,
} from '@/actions/competition';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    code: string;
  };
}

export default async function AdminLayout({
  children,
  params: { code },
}: PropsWithChildren<Props>) {
  const session = await auth();

  const competitionsWithStats = await getCompetitionsWithStats();
  if (!competitionsWithStats.some((c) => c.code === code))
    redirect('/admin/comp');

  return (
    <AdminShell
      session={session!}
      competitions={competitionsWithStats}
      code={code}
    >
      {children}
    </AdminShell>
  );
}
