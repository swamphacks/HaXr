import React, { PropsWithChildren, useEffect } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { auth } from '@/auth';

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return <AdminShell session={session!}>{children}</AdminShell>;
}
