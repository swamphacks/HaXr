'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Application, Attendee, User } from '@prisma/client';
import { useDisclosure } from '@mantine/hooks';
import { getUser } from '@/actions/scanning';
import { notifications } from '@mantine/notifications';
import { IconUserQuestion } from '@tabler/icons-react';
import QrScanner from '@/components/scan/QrScanner';
import CheckInModal from '@/components/checkin/CheckInModal';
import { Divider, LoadingOverlay, Stack } from '@mantine/core';
import CheckInTable from '@/components/checkin/CheckInTable';
import { TypedApplication } from '@/app/hacker/application/[code]/page';

interface Props {
  comp: string;
  applicants: (TypedApplication & { user: User; attendee?: Attendee })[];
}

export default function CheckIn({ comp, applicants }: Props) {
  const [visible, { open, close }] = useDisclosure(false);
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);

  const selectUser = useCallback(
    async (userId: string) => {
      if (user) return;

      open();
      const selectedUser = await getUser(userId);
      if (!selectedUser) {
        notifications.show({
          title: 'User not found',
          message: 'This is not a valid user ID',
          color: 'red',
          icon: <IconUserQuestion size={16} />,
        });
      } else setUser(selectedUser);
      close();
    },
    [user, open, close]
  );

  // TODO: figure out why I used this ridiculous ref hack (this is the devil's work)
  useEffect(() => {
    userRef.current = user; // Update the ref whenever the user state changes
  }, [user]);

  return (
    <>
      <CheckInModal
        comp={comp}
        user={user}
        deselectUser={() => setUser(null)}
      />

      <Stack align='center'>
        <LoadingOverlay
          visible={visible}
          overlayProps={{ radius: 'sm', blur: 3 }}
        />
        <QrScanner onScan={selectUser} rememberAs='applicant-scanner' />
      </Stack>

      <Divider my='sm' />

      <CheckInTable applicants={applicants} selectUser={selectUser} />
    </>
  );
}
