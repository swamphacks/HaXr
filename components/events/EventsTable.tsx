'use client';

import { createEvent, updateEvent } from '@/actions/events';
import { EventWithInfo } from '@/types/events';
import { Group, Button, ActionIcon, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconQrcode, IconScan } from '@tabler/icons-react';
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface Props {
  compCode: string;
  eventsWithInfo: EventWithInfo[];
}

export default function EventsTable({ compCode, eventsWithInfo }: Props) {
  const columns = useMemo<MRT_ColumnDef<EventWithInfo>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        enableEditing: true,
      },
      {
        header: '# of Attendees',
        accessorKey: 'numAttendees',
        enableEditing: false,
      },
    ],
    []
  );

  const [data, setData] = useState<EventWithInfo[]>(eventsWithInfo);

  const handleCreate: MRT_TableOptions<EventWithInfo>['onCreatingRowSave'] =
    async ({ values, exitCreatingMode }) => {
      await createEvent(compCode, values.name);
      setData((prev) => [
        ...prev,
        {
          ...values,
          numAttendees: 0,
        },
      ]);

      exitCreatingMode();
      notifications.show({
        title: 'Event Created',
        message: `Event "${values.name}" has been created.`,
        color: 'green',
      });
    };

  const handleEdit: MRT_TableOptions<EventWithInfo>['onEditingRowSave'] =
    async ({ table, row, values }) => {
      console.log(row);
      await updateEvent(row.original.id, values.name);
      data[row.index] = values;
      setData([...data]);

      table.setEditingRow(null);
      notifications.show({
        title: 'Event Updated',
        message: `Event "${values.name}" has been updated.`,
        color: 'blue',
      });
    };

  const table = useMantineReactTable({
    columns,
    data,

    enableEditing: true,
    createDisplayMode: 'modal',
    editDisplayMode: 'row',
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleEdit,

    renderTopToolbarCustomActions: ({ table }) => (
      <Group gap='xs'>
        <Button
          size='xs'
          variant='light'
          leftSection={<IconPlus />}
          onClick={() => table.setCreatingRow(true)}
        >
          Create Event
        </Button>

        <Button
          size='xs'
          color='violet'
          variant='light'
          leftSection={<IconQrcode />}
          component={Link}
          href={`/admin/comp/${compCode}/scan/event`}
        >
          Scan for Attendance
        </Button>
      </Group>
    ),
  });

  return <MantineReactTable table={table} />;
}
