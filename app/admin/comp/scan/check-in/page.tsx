'use client';
import { Group, LoadingOverlay } from '@mantine/core';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CompetitionContext } from '@/components/admin/AdminShell';
import { useDisclosure } from '@mantine/hooks';
import QrScanner from '@/components/scan/QrScanner';
import CheckInModal from '@/components/checkin/CheckInModal';
import { User } from '@prisma/client';
import { getUser } from '@/actions/scanning';
import { notifications } from '@mantine/notifications';
import { IconUserQuestion } from '@tabler/icons-react';

export default function ScanCheckIn() {
  const { competition } = useContext(CompetitionContext);

  const [visible, { open, close }] = useDisclosure(false);
  const [user, setUser] = useState<User | null>(null);
  const userRef = useRef<User | null>(null);

  const handleScan = useCallback(
    async (userId: string) => {
      if (!competition || userId === userRef.current?.id) return;

      open();
      const scannedUser = await getUser(userId);
      if (!scannedUser) {
        notifications.show({
          title: 'User not found',
          message: 'This QR code does not correspond to any user',
          color: 'red',
          icon: <IconUserQuestion size={16} />,
        });
      } else setUser(scannedUser);
      close();
    },
    [competition, open, close]
  );

  useEffect(() => {
    userRef.current = user; // Update the ref whenever the user state changes
    console.log('Updated user:', user);
  }, [user]);

  return (
    <>
      <CheckInModal
        comp={competition?.code ?? null}
        user={user}
        deselectUser={() => setUser(null)}
      />

      <Group justify='center' align='center'>
        <LoadingOverlay
          visible={visible}
          overlayProps={{ radius: 'sm', blur: 3 }}
        />
        <QrScanner onScan={handleScan} />
      </Group>
    </>
  );
}
