'use client';
import { LoadingOverlay } from '@mantine/core';
import { Application, Status } from '@prisma/client';
import { promoteFromWaitlist } from '@/actions/applications';
import { IconCircleX, IconConfetti } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PromoteError } from '@/types/waitlist';
import { notifications } from '@mantine/notifications';
import useCountdownTimer from '@/hooks/useCountdownTimer';
import dynamic from 'next/dynamic';
import { CompetitionWithWaitlist } from '@/app/hacker/waitlist/[code]/page';

// So hydration errors don't occur
const WaitlistEarlyScreen = dynamic(() => import('./WaitlistScreen'), {
  ssr: false,
});

interface Props {
  competition: CompetitionWithWaitlist;
  statusCounts: Record<Status, number>;
  userApplication: Application;
}

const PromoteErrorMessages: Record<PromoteError, string> = {
  [PromoteError.NOT_ON_WAITLIST]:
    "You cannot be promoted from the waitlist if you're not waitlisted.",
  [PromoteError.MAX_CAPACITY_REACHED]:
    'Sorry, all spots are currently filled. Spots may open up later if someone decides not to attend. Stay posted!',
  [PromoteError.APPLICATION_NOT_FOUND]:
    'We could not find your application. Please report this to the organizers.',
  [PromoteError.BEFORE_WAITLIST_OPEN]:
    'Not quite yet! The waitlist has not opened yet.',
  [PromoteError.AFTER_WAITLIST_CLOSE]: 'Sorry, the waitlist is closed.',
};

export default function WaitlistDashboard({
  competition,
  statusCounts,
  userApplication,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Countdown to waitlist open
  const { timeLeft, complete, isInitialized } = useCountdownTimer(
    competition.waitlist_open
  );

  useEffect(() => {
    (async () => {
      if (complete) {
        setLoading(true);

        const result = await promoteFromWaitlist(userApplication.id);
        if (result.status === 'success') {
          notifications.show({
            title: 'Congratulations!',
            message: 'You have successfully secured your seat!',
            icon: <IconConfetti />,
            color: 'green',
            autoClose: 5000,
          });
        } else {
          notifications.show({
            title: "That didn't go as planned...",
            message: PromoteErrorMessages[result.error],
            icon: <IconCircleX />,
            color: 'red',
            autoClose: 5000,
          });
        }

        router.replace('/hacker'); // Send them back to their dashboard
      }
    })();
  }, [complete, userApplication.id, router]);

  const spotsRemaining = !competition.max_attendees ? (
    '∞'
  ) : (
    <>{competition.max_attendees - statusCounts[Status.ATTENDING]}</>
  );

  // If waitlist isn't open, show the following screen
  return (
    isInitialized && (
      <>
        <LoadingOverlay visible={false} />
        <WaitlistEarlyScreen competition={competition} countdown={timeLeft} />
      </>
    )
  );
}
