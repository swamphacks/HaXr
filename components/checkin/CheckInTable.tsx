import { Application, Attendee, Status, User } from '@prisma/client';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { ActionIcon, Avatar, Code, Group, Notification } from '@mantine/core';
import { IconDoorEnter, IconDoorExit, IconPencil } from '@tabler/icons-react';
import { TypedApplication } from '@/app/hacker/application/[code]/page';
import { checkOut } from '@/actions/scanning';
import { notifications } from '@mantine/notifications';

interface Props {
  applicants: (TypedApplication & { user: User; attendee?: Attendee })[];
  selectUser: (userId: string) => void;
}

export default function CheckInTable({ applicants, selectUser }: Props) {
  const columns = useMemo<
    MRT_ColumnDef<TypedApplication & { user: User; attendee?: Attendee }>[]
  >(
    () => [
      {
        header: 'Name',
        accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
        filterVariant: 'autocomplete',
        Cell: ({ renderedCellValue, row }) => (
          <Group wrap='nowrap'>
            <Avatar src={row.original.user.image} size='md' />
            {renderedCellValue}
          </Group>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'content.email',
      },
      {
        header: 'Checked-in At',
        accessorKey: 'attendee.checkInAt',
        Cell: ({ row }) =>
          row.original.attendee
            ? new Date(row.original.attendee.checkedInAt).toLocaleString()
            : 'Not checked in',
      },
      {
        header: 'Badge ID',
        accessorKey: 'attendee.badgeId',
        Cell: ({ renderedCellValue }) => <Code>{renderedCellValue}</Code>,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: applicants,
    initialState: {
      density: 'xs',
    },
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <ActionIcon.Group>
        {!row.original.attendee ? (
          <ActionIcon onClick={() => selectUser(row.original.user.id)}>
            <IconDoorEnter />
          </ActionIcon>
        ) : (
          <>
            <ActionIcon onClick={() => selectUser(row.original.user.id)}>
              {!row.original.attendee ? <IconDoorEnter /> : <IconPencil />}
            </ActionIcon>

            <ActionIcon
              color='red'
              onClick={() =>
                removeAttendee(
                  row.original as TypedApplication & {
                    user: User;
                    attendee: Attendee;
                  }
                )
              }
            >
              <IconDoorExit />
            </ActionIcon>
          </>
        )}
      </ActionIcon.Group>
    ),
  });

  return <MantineReactTable table={table} />;
}

const removeAttendee = async ({
  attendee: { applicationId },
  content: { firstName, lastName },
}: TypedApplication & { user: User; attendee: Attendee }) => {
  if (
    confirm(
      'Are you sure you want to remove this attendee? This will permanently delete any related attendee data.'
    )
  ) {
    const result = await checkOut(applicationId);
    if (result.ok) {
      notifications.show({
        title: 'Check-out Successful',
        message: `Successfully removed un-checked-in ${firstName} ${lastName}.`,
        color: 'green',
      });
    } else {
      notifications.show({
        title: 'Check-out Failed',
        message: `Failed to remove un-checked-in ${firstName} ${lastName}. ${result.error}}`,
        color: 'red',
      });
    }
  }
};
