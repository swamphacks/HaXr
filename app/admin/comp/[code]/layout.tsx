import React, { PropsWithChildren } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { auth } from '@/auth';
import { getCompetitions } from '@/actions/competition';
import { redirect } from 'next/navigation';
import { ApplicationData, getApplicationData } from '@/actions/applications';

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

  // Get competitions
  const competitions = await getCompetitions();
  if (!competitions.some((c) => c.code === code)) redirect('/admin/comp');

  // Get application data (e.g # of applications, # reviewed, etc)
  const applicationData: ApplicationData = await getApplicationData(code);

  return (
    <AdminShell
      session={session!}
      competitions={competitions}
      code={code}
      applicationData={applicationData}
    >
      {children}
    </AdminShell>
  );
}
