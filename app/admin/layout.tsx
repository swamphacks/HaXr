import AdminShell from '@/components/admin/AdminShell';
import { auth } from '@/auth';
import { PropsWithChildren } from 'react';

export default async function AdminLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const session = await auth();

  return <AdminShell session={session!}>{children}</AdminShell>;
}
