'use client';
import { Application, Status, User } from '@prisma/client';
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { HackerApplicationFormValues } from '@/app/hacker/application/[code]/page';
import { Anchor, Button, Menu } from '@mantine/core';
import { setApplicationStatus } from '@/actions/applications';
import { IconChevronDown } from '@tabler/icons-react';

type TypedApplicants = Omit<Application, 'content'> & {
  content: HackerApplicationFormValues;
};

interface Props {
  applicants: (TypedApplicants & {
    user: User;
  })[];
}

export default function AppsTable({ applicants }: Props) {
  const columns = useMemo<MRT_ColumnDef<TypedApplicants & { user: User }>[]>(
    () => [
      {
        header: 'Name',
        accessorFn: ({ content: { firstName, lastName } }) =>
          `${firstName} ${lastName}`,
        enableEditing: false,
      },
      {
        header: 'School',
        accessorKey: 'content.school',
        enableEditing: false,
      },
      {
        header: 'Grad Date',
        accessorFn: ({
          content: { graduationMonth: month, graduationYear: year },
        }) => `${month} ${year}`,
        enableEditing: false,
      },
      {
        header: 'Experience',
        accessorKey: 'content.hackathonExperience',
        enableEditing: false,
      },
      {
        header: 'Resume',
        Cell: ({ row }) => (
          <Anchor href={row.original.content.resumeUrl} target='_blank'>
            View
          </Anchor>
        ),
        enableEditing: false,
      },
      {
        header: 'Status',
        accessorKey: 'status',
        editVariant: 'select',
        enableEditing: true,
        mantineEditSelectProps: ({ row }) => ({
          data: Object.values(Status),
          onChange: async (status) => {
            // type ?? why tf knows
            console.log(
              `Updating status to ${status} for ${row.original.user.email}`
            );

            await setApplicationStatus(
              row.original.id,
              status as unknown as Status
            ).catch(console.error);
          },
        }),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: applicants,
    enableEditing: true,
    editDisplayMode: 'table',
    enableGrouping: true,
    enableColumnOrdering: true,
    initialState: {
      density: 'xs',
    },
    enableRowSelection: true,
    renderTopToolbarCustomActions: ({ table }) => {
      const getSelectedAppIds = () =>
        table.getSelectedRowModel().rows.map((r) => r.original.id);

      return (
        <Menu>
          <Menu.Target>
            <Button rightSection={<IconChevronDown size={18} />}>Status</Button>
          </Menu.Target>

          <Menu.Dropdown>
            {Object.values(Status).map((status) => (
              <Menu.Item
                key={status}
                tt='capitalize'
                onClick={async () => {
                  const update = Promise.all(
                    getSelectedAppIds().map((appId) =>
                      setApplicationStatus(appId, status).then(() =>
                        console.log(appId)
                      )
                    )
                  );

                  alert('Updating statuses... (wait for done alert)');
                  await update;
                  alert('Done updating statuses');
                }}
              >
                {status}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      );
    },
    // enableRowActions: true,
    // renderRowActions: ({ row }) => (
    //   <Group justify='center'>
    //     <ActionIcon
    //       variant='subtle'
    //       onClick={() => selectUser(row.original.user.id)}
    //       title='Check In'
    //       aria-label='Check In'
    //     >
    //       <IconDoorEnter />
    //     </ActionIcon>
    //   </Group>
    // ),
  });

  return <MantineReactTable table={table} />;
}
