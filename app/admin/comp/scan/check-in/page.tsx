import CheckIn from '@/components/checkin/CheckIn';
import { getApplicants } from '@/actions/applications';

export default async function ScanCheckIn() {
  return <CheckIn applicants={await getApplicants('x')} />;
}
