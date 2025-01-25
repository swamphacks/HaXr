'use client';
import { Event } from '@prisma/client';
import QrScanner from '@/components/scan/QrScanner';
import { useCallback, useState } from 'react';
import { Center, Divider, Select, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { markAttendance } from '@/actions/events';

interface Props {
  events: Event[];
}
export default function ScanEvents({ events }: Props) {
  const [eventId, setEventId] = useState<string | null>(null);

  const onScan = useCallback(
    async (badgeId: string) => {
      if (!eventId) {
        notifications.show({
          color: 'red',
          title: 'Event not selected',
          message: 'Please select an event before scanning badges',
        });
        return;
      }

      if (await markAttendance(eventId, badgeId)) {
        notifications.show({
          color: 'green',
          title: 'Success',
          message: `Badge ${badgeId} scanned for event ${eventId}`,
          autoClose: 1500,
        });
      } else {
        notifications.show({
          color: 'red',
          title: 'Error',
          message: `Badge ${badgeId} could not be scanned for event ${eventId}`,
        });
      }
    },
    [eventId]
  );

  return (
    <Center>
      <Stack maw={500}>
        <Select
          label='Event'
          placeholder='Select an event'
          data={events.map((e) => ({ value: e.id, label: e.name }))}
          value={eventId}
          onChange={setEventId}
        />

        <Divider />

        <QrScanner onScan={onScan} rememberAs='event-scanner' />
      </Stack>
    </Center>
  );
}
