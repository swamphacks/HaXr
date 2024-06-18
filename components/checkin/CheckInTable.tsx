import { Application, Status, User } from '@prisma/client';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { ActionIcon, Avatar, Group } from '@mantine/core';
import { IconDoorEnter } from '@tabler/icons-react';
import { AppStatus } from '@/components/applications/AppStatus';

interface Props {
  applicants: (Application & { user: User })[];
  selectUser: (userId: string) => void;
}

export default function CheckInTable({ applicants, selectUser }: Props) {
  const columns = useMemo<MRT_ColumnDef<Application & { user: User }>[]>(
    () => [
      {
        accessorFn: (row) => `${row.user.firstName} ${row.user.lastName}`,
        header: 'Name',
        filterVariant: 'autocomplete',
        Cell: ({ renderedCellValue, row }) => (
          <Group wrap='nowrap'>
            <Avatar src={row.original.user.image} size='md' />
            {renderedCellValue}
          </Group>
        ),
      },
      {
        accessorKey: 'user.email',
        header: 'Email',
      },
      {
        accessorKey: 'user.phone',
        header: 'Phone #',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'select',
        Cell: ({ cell }) => AppStatus[cell.getValue<Status>()],
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
      <Group justify='center'>
        <ActionIcon
          variant='subtle'
          onClick={() => selectUser(row.original.user.id)}
        >
          <IconDoorEnter />
        </ActionIcon>
      </Group>
    ),
  });

  return <MantineReactTable table={table} />;
}
