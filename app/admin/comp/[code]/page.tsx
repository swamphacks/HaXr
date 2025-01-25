import { getCheckInApplicants } from '@/actions/scanning';
import { Code, Divider } from '@mantine/core';
import { Status } from '@prisma/client';

interface Props {
  params: {
    code: string;
  };
}

export default async function Admin({ params: { code } }: Props) {
  const { checkedIn, total } = await getCheckInApplicants(code).then((apps) => {
    const attending = apps.filter((app) => app.status === Status.ATTENDING);

    return {
      checkedIn: attending.filter((app) => app.attendee !== null).length,
      total: attending.length,
    };
  });

  return (
    <>
      Managing competition with <Code>code = {code}</Code>.
      <Divider my='sm' />
      {checkedIn} / {total} attendees checked in (
      {((checkedIn / total) * 100).toFixed(0)}%)
    </>
  );
}
