import { getCompetitions } from '@/actions/competition';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getAdminLinks } from '@/actions/admin';

export default async function Dashboard() {
  return (
    <AdminDashboard
      links={await getAdminLinks()}
      competitions={await getCompetitions()}
    />
  );
}
