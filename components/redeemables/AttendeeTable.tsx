'use client';

import { useMemo, useState } from 'react';
import { Redeemable, Application, User } from '@prisma/client';
import { Button, Text } from '@mantine/core';
import { GetAttendeesResponse } from '@/types/application';
import { createTransaction } from '@/actions/redeemable';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { IconScan } from '@tabler/icons-react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  type MRT_Row,
} from 'mantine-react-table';

interface Props {
  compCode: string;
  applicants: Required<GetAttendeesResponse>[];
  redeemableName: string | null;
  quantity: number | null;
  action: string | null;
}

export default function AttendeeTable({
  compCode,
  applicants,
  redeemableName,
  quantity,
  action,
}: Props) {
  const columns = useMemo<MRT_ColumnDef<Required<GetAttendeesResponse>>[]>(
    () => [
      {
        header: 'Name',
        accessorFn: ({ user: { firstName, lastName } }) =>
          `${firstName} ${lastName}`,
        enableEditing: false,
      },
      {
        header: 'Email',
        accessorFn: ({ user }) => user.email,
        enableEditing: false,
      },
    ],
    []
  );

  const [data, setData] = useState<Required<GetAttendeesResponse>[]>(
    () => applicants
  );
  const openTransactionModal = (
    row: MRT_Row<Required<GetAttendeesResponse>>
  ) => {
    return modals.openConfirmModal({
      title: 'Confirm Transaction',
      children: (
        <div className='flex flex-col gap-4'>
          <div>
            <h1 className='font-bold'>Redeemable</h1>
            <p>{redeemableName}</p>
          </div>
          <div>
            <h1 className='font-bold'>Action</h1>
            <p>{action}</p>
          </div>
          <div>
            <h1 className='font-bold'>Quantity</h1>
            <p>{quantity}</p>
          </div>
          <div>
            <h1 className='font-bold'>Attendee</h1>
            <p>{`${row.original.user.firstName} ${row.original.user.lastName}`}</p>
          </div>
        </div>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const resp = await createTransaction({
            competitionCode: compCode,
            redeemableName: redeemableName ?? '',
            quantity: (action === 'Redeem' ? -1 : 1) * (quantity ?? 1),
            userId: row.original.userId,
          });

          if (resp.status === 201) {
            notifications.show({
              color: 'green',
              title: 'Success!',
              message: 'Transaction created successfully.',
            });
          } else {
            notifications.show({
              color: 'red',
              title: 'Error creating transaction',
              message: resp.statusText,
            });
          }
        } catch (e) {
          notifications.show({
            color: 'red',
            title: 'An unknown error occurred.',
            message: 'Check console for more info.',
          });
          console.error(e);
        }
      },
    });
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableEditing: false,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Button
        color='green'
        onClick={() => openTransactionModal(row)}
        disabled={!redeemableName || !quantity || !action}
        styles={{
          root: { '--button-padding-x': '3px', '--button-height': '32px' },
        }}
      >
        <IconScan color='white' />
      </Button>
    ),
  });

  return <MantineReactTable table={table} />;
}
