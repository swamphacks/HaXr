'use client';
import { Alert, Button, Center, Container, Stack, Text } from '@mantine/core';
import { Application, Competition, Status } from '@prisma/client';
import AttendingScreen from './AttendingScreen';
import IneligibleScreen from './IneligibleScreen';
import { MAX_SEAT_CAPACITY } from '@/constants/attendance';
import { updateWaitlistStatusAttending } from '@/actions/applications';
import { IconCircleX } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaitlistEarlyScreen from './WaitlistEarlyScreen';
import WaitlistLateScreen from './WaitlistLateScreen';
interface Props {
  competition: Competition;
  statusCounts: Record<Status, number>;
  userApplication: Application | null;
}

const IneligibleStatuses: Status[] = [
  Status.APPLIED,
  Status.REJECTED,
  Status.STARTED,
  Status.NOT_ATTENDING,
];

export default function WaitlistDashboard({
  competition,
  statusCounts,
  userApplication,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSecureSeat = async () => {
    setError(null);
    setLoading(true);

    if (!userApplication) {
      setError(
        'We could not find your application. Please refresh the page and try again.'
      );
      setLoading(false);
      return;
    }

    const { application, error } = await updateWaitlistStatusAttending(
      competition.code,
      userApplication?.id
    );

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    if (!application) {
      setError('Something went wrong. Please refresh the page and try.');
      setLoading(false);
      return;
    }

    // Everything went well
    setLoading(false);
    router.refresh();
  };

  // If waitlist isn't open, show the following screen
  if (competition.confirm_by > new Date())
    return <WaitlistEarlyScreen competition={competition} />;

  // If competition already started, show the following screen
  if (competition.start_date < new Date())
    return <WaitlistLateScreen competition={competition} />;

  if (
    !userApplication ||
    IneligibleStatuses.includes(userApplication?.status)
  ) {
    return (
      <IneligibleScreen
        competition={competition}
        userApplication={userApplication}
      />
    );
  }

  if (userApplication.status === Status.ATTENDING) {
    return (
      <AttendingScreen competition={competition} statusCounts={statusCounts} />
    );
  }

  return (
    <Container h='100vh'>
      <Center h='100%' w='100%'>
        <Stack align='center' w='100%' gap='xl'>
          {/* Responseive count */}
          <Stack align='center' gap='sm'>
            <Text ta='center' fw={600} size='15vw' visibleFrom='md'>
              {MAX_SEAT_CAPACITY - (statusCounts.ATTENDING ?? 0)}
            </Text>
            <Text ta='center' fw={600} size='25vw' hiddenFrom='md'>
              {MAX_SEAT_CAPACITY - (statusCounts.ATTENDING ?? 0)}
            </Text>

            {/* Subtext */}

            <Text size='xl' visibleFrom='md'>
              seats remaining for {competition.name}
            </Text>

            <Text size='md' hiddenFrom='md'>
              seats remaining for {competition.name}
            </Text>
          </Stack>

          {/* Buttons */}

          <Button
            w='60%'
            loading={loading}
            visibleFrom='md'
            size='xl'
            onClick={onSecureSeat}
          >
            Secure A Seat
          </Button>
          <Button
            w='90%'
            loading={loading}
            hiddenFrom='md'
            size='lg'
            onClick={onSecureSeat}
          >
            Secure A Seat
          </Button>

          {/* The widths are to match the button */}
          {error && (
            <Alert
              w={{ base: '90%', md: '60%' }}
              color='red'
              title='Error'
              icon={<IconCircleX />}
            >
              {error}
            </Alert>
          )}
        </Stack>
      </Center>
    </Container>
  );
}
