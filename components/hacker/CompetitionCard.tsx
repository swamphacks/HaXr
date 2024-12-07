import { CompetitionWithApplication } from '@/actions/applications';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Status } from '@prisma/client';
import {
  IconCalendar,
  IconChevronRight,
  IconCircleX,
  IconConfetti,
  IconMapPin,
  IconMoodSad,
  IconZoomMoney,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface Props {
  competition: CompetitionWithApplication;
}

const formatDateTime = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function CompetitionCard({
  competition: {
    code,
    name,
    description,
    location,
    apply_open, // date
    apply_close, //dat
    decision_release, // date
    start_date,
    end_date,
    application,
  },
}: Props) {
  const router = useRouter();

  const startDateStr = formatDateTime(start_date),
    endDateStr = formatDateTime(end_date),
    sameDay = startDateStr === endDateStr;

  const StatusButton: Record<Status | 'NOT_STARTED', React.ReactElement> = {
    NOT_STARTED: (
      <Button
        color='green'
        rightSection={<IconChevronRight />}
        onClick={() => router.push(`/hacker/application/${code}`)}
      >
        Apply
      </Button>
    ),

    [Status.STARTED]: (
      <Button
        color='blue'
        rightSection={<IconChevronRight />}
        onClick={() => router.push(`/hacker/application/${code}`)}
      >
        Continue
      </Button>
    ),
    [Status.APPLIED]: (
      <Button
        color='yellow'
        variant='light'
        rightSection={<IconZoomMoney />}
        onClick={() => router.push(`/hacker/application/${code}`)}
      >
        Under Review
      </Button>
    ),

    [Status.REJECTED]: (
      <Button color='red' variant='light' rightSection={<IconCircleX />}>
        Rejected
      </Button>
    ),
    [Status.WAITLISTED]: (
      <Button color='green' rightSection={<IconChevronRight />}>
        Continue
      </Button>
    ),
    [Status.ACCEPTED]: (
      <Button
        color='green'
        rightSection={<IconChevronRight />}
        onClick={() => console.log('Please accept the invitation')}
      >
        Accepted
      </Button>
    ),

    [Status.NOT_ATTENDING]: (
      <Button color='red' variant='light' rightSection={<IconMoodSad />}>
        Not Attending
      </Button>
    ),
    [Status.ATTENDING]: (
      <Button color='green' variant='light' rightSection={<IconConfetti />}>
        Attending
      </Button>
    ),
  };

  let status = application?.status || 'NOT_STARTED';
  const now = new Date();

  // Hidden during review period
  if (now > apply_open && now < apply_close) {
    if (
      status === Status.ACCEPTED ||
      status === Status.WAITLISTED ||
      status === Status.REJECTED
    )
      status = Status.APPLIED;
  }

  return (
    <Card w='100%'>
      <Group justify='space-between' px={10} py={10}>
        <Stack gap='xs'>
          <Title order={2}>{name}</Title>
          <Text>{description}</Text>

          <Group gap='xl'>
            <Group gap='xs'>
              <IconMapPin size={20} color='gray' />
              <Text c='dimmed' size='md' mt={3}>
                {location}
              </Text>
            </Group>

            <Group gap='xs'>
              <IconCalendar size={20} color='gray' />
              <Text c='dimmed' size='md' mt={3}>
                {sameDay ? startDateStr : `${startDateStr} - ${endDateStr}`}
              </Text>
            </Group>
          </Group>
        </Stack>

        {StatusButton[application?.status || 'NOT_STARTED']}
      </Group>
    </Card>
  );
}
