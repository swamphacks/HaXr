import CheckIn from '@/components/checkin/CheckIn';
import { getApplicants } from '@/actions/applications';

interface Props {
  params: {
    code: string;
  };
}

export default async function ScanCheckIn({ params: { code } }: Props) {
  return <CheckIn comp={code} applicants={await getApplicants(code)} />;
}
