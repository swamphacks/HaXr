import CheckIn from '@/components/checkin/CheckIn';
import { getCheckInApplicants } from '@/actions/scanning';
import { TypedApplication } from '@/app/hacker/application/[code]/page';

interface Props {
  params: {
    code: string;
  };
}

export default async function ScanCheckIn({ params: { code } }: Props) {
  const checkInApplicants = (await getCheckInApplicants(code)).map(
    ({ content, attendee, ...rest }) => ({
      ...rest,
      content: content as unknown as TypedApplication['content'],
    })
  );

  return <CheckIn comp={code} applicants={checkInApplicants} />;
}
