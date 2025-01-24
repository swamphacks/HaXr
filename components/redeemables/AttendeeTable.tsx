'use client';

import { useMemo, useState } from 'react';
import { Button } from '@mantine/core';
import { GetAttendeesResponse } from '@/types/application';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { IconScan } from '@tabler/icons-react';
import { onTransactionConfirm } from '@/utils/redeemable';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'mantine-react-table';
import TransactionModal from '@/components/redeemables/TransactionModal';

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
    if (!redeemableName || !quantity || !action) {
      notifications.show({
        color: 'red',
        title: 'Missing fields',
        message: 'Please select a redeemable, quantity, and action',
      });
      close();
      return;
    }

    const user = row.original.user;

    return modals.openConfirmModal({
      title: 'Confirm Transaction',
      children: (
        <TransactionModal
          redeemableName={redeemableName}
          action={action}
          quantity={quantity}
          competitionCode={compCode}
          user={user}
        />
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () =>
        await onTransactionConfirm(
          user,
          compCode,
          redeemableName,
          action,
          quantity
        ),
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
