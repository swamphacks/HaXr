import { Application, User } from '@prisma/client';
import {
  Avatar,
  Button,
  Code,
  Modal,
  Overlay,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { checkIn, getCheckInChecks } from '@/actions/scanning';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Check } from '@/types/scanning';
import { getApplicationByUser } from '@/actions/applications';
import CheckInChecks from './CheckInChecks';
import QrScanner from '../scan/QrScanner';
import { IconCheck } from '@tabler/icons-react';

interface Props {
  comp: string | null;
  user: User | null;
  deselectUser: () => void;
}

export default function CheckInModal({ comp, user, deselectUser }: Props) {
  const [application, setApplication] = useState<Application | null>(null);
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [badgeId, setBadgeId] = useState<string | null>(null);

  useEffect(() => {
    // Ensure are checking into the correct competition. Don't receive application ID's, we specify the competition!
    if (comp && user) {
      getApplicationByUser(comp, user.id).then(async (app) => {
        setApplication(app);
        if (app)
          await getCheckInChecks(app.id).then((tasks) => setChecks(tasks));
      });
    }
  }, [comp, user]);

  return (
    <Modal
      opened={user !== null}
      withCloseButton={false}
      onClose={deselectUser}
      size='auto'
      centered={true}
      padding='lg'
    >
      {user && application && checks && (
        <>
          <Stack justify='center' align='center' gap={20}>
            <Stack align='center' gap={20}>
              <Avatar size='xl' src={user.image} alt='Profile Picture' />
              <Stack align='center' gap={0}>
                <Title order={2}>
                  {user.firstName} {user.lastName}
                </Title>
                <Title order={4}>University</Title>
                <Text>({user.email})</Text>
              </Stack>
            </Stack>
          </Stack>

          <CheckInChecks checks={checks} />

          <Stack align='center' pos='relative'>
            {badgeId && (
              <Overlay
                bg='green'
                center
                radius={10}
                onClick={() => setBadgeId(null)}
              >
                <Stack align='center' gap='xs'>
                  <IconCheck size={128} />

                  <Text size='xl'>
                    <b>Badge Scanned</b> <br />
                    <i>(Click to Re-scan)</i>
                  </Text>

                  <Code>{badgeId}</Code>
                </Stack>
              </Overlay>
            )}

            <QrScanner onScan={setBadgeId} rememberAs='badge-scanner' />
          </Stack>

          <Stack gap='xs' mt='sm'>
            <Button
              color='green'
              size='md'
              fullWidth
              onClick={async () => {
                if (
                  !badgeId &&
                  !confirm('You did not scan a badge. Continue with check-in?')
                )
                  return;

                const r = await checkIn(application.id, badgeId ?? undefined);
                if ('error' in r) {
                  if (r.checks) setChecks(r.checks);
                  notifications.show({
                    title: 'Failure',
                    message: r.error,
                    color: 'red',
                  });
                } else {
                  deselectUser();
                  setBadgeId(null); // Doesn't unmount
                  notifications.show({
                    title: 'Success',
                    message: r.idempotent
                      ? 'Hacker has already been checked in'
                      : 'Hacker was successfully checked in',
                    color: 'green',
                  });
                }
              }}
            >
              Check In
            </Button>

            <Button
              size='md'
              fullWidth
              color='red'
              variant='outline'
              onClick={deselectUser}
            >
              Exit
            </Button>
          </Stack>
        </>
      )}
    </Modal>
  );
}
