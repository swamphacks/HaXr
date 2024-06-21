'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Application, User } from '@prisma/client';
import { useDisclosure } from '@mantine/hooks';
import { getUser } from '@/actions/scanning';
import { notifications } from '@mantine/notifications';
import { IconUserQuestion } from '@tabler/icons-react';
import QrScanner from '@/components/scan/QrScanner';
import CheckInModal from '@/components/checkin/CheckInModal';
import { Divider, LoadingOverlay, Stack } from '@mantine/core';
import CheckInTable from '@/components/checkin/CheckInTable';

interface Props {
  comp: string;
  applicants: (Application & { user: User })[];
}

export default function CheckIn({ comp, applicants }: Props) {
  const [visible, { open, close }] = useDisclosure(false);
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);

  const selectUser = useCallback(
    async (userId: string) => {
      if (userId === userRef.current?.id) return;

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
    [open, close]
  );

  useEffect(() => {
    userRef.current = user; // Update the ref whenever the user state changes
    console.log('Updated user:', user);
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
        <QrScanner onScan={selectUser} />
      </Stack>

      <Divider my='sm' />

      <CheckInTable applicants={applicants} selectUser={selectUser} />
    </>
  );
}
