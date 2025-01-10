'use client';
import { Alert, Button, Center, Container, Stack, Text } from '@mantine/core';
import { Application, Competition, Status } from '@prisma/client';
import AttendingScreen from './AttendingScreen';
import { MAX_SEAT_CAPACITY } from '@/constants/attendance';
import { promoteFromWaitlist } from '@/actions/applications';
import { IconCircleX, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaitlistLateScreen from './WaitlistLateScreen';
import { PromoteError } from '@/types/waitlist';
import { notifications } from '@mantine/notifications';
import { getIneligibleReason } from '@/utils/waitlist/ineligible';
import useCountdownTimer from '@/hooks/useCountdownTimer';
import dynamic from 'next/dynamic';

// So hydration errors don't occur
const WaitlistEarlyScreen = dynamic(() => import('./WaitlistEarlyScreen'), {
  ssr: false,
});

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
  Status.ACCEPTED, // Forfeited spot
];

export default function WaitlistDashboard({
  competition,
  statusCounts,
  userApplication,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Waitlist countdown states
  const { timeLeft, countdownComplete, isInitialized } = useCountdownTimer(
    competition.confirm_by
  );

  const onSecureSeat = async () => {
    setLoading(true);
    setError(null);

    if (!userApplication) {
      setError('Something went wrong. Please refresh and try again.');
      setLoading(false);
      return;
    }

    const result = await promoteFromWaitlist(userApplication.id);

    if (result.status === 'error') {
      switch (result.error) {
        case PromoteError.INVALID_STATUS:
          setError('Your application status is not valid.');
          break;
        case PromoteError.MAX_CAPACITY_REACHED:
          setError('Sorry! The competition is full.');
          break;
        case PromoteError.APPLICATION_NOT_FOUND:
          setError('Application not found.');
          break;
        case PromoteError.COMPETITION_NOT_FOUND:
          setError('Competition not found.');
          break;
        case PromoteError.BEFORE_CONFIRMATION_DEADLINE:
          setError('The waitlist is not open yet.');
          break;
        case PromoteError.AFTER_COMPETITION_START:
          setError(
            'The competition has already started and the waitlist is closed.'
          );
          break;
        default:
          setError('An unknown error occurred.');
      }
    } else {
      // No need to setLoading(true) here, as we're refreshing the page.
      router.refresh();
    }

    setLoading(false);
  };

  // If waitlist isn't open, show the following screen
  if (!countdownComplete && isInitialized) {
    return (
      <WaitlistEarlyScreen competition={competition} countdown={timeLeft} />
    );
  }

  // If competition already started, show the following screen
  if (competition.start_date < new Date())
    return <WaitlistLateScreen competition={competition} />;

  if (
    !userApplication ||
    IneligibleStatuses.includes(userApplication?.status)
  ) {
    // Redirect to /hacker with proper notification
    notifications.show({
      title: 'Error',
      message: getIneligibleReason(userApplication?.status),
      color: 'red',
      icon: <IconX />,
      autoClose: false,
      withCloseButton: true,
    });

    router.replace('/hacker');
    return null;
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
