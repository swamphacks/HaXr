'use client';

import { TransactionWithUserAndRedeemable } from '@/types/redeemable';
import { useMemo, useState } from 'react';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { deleteTransaction } from '@/actions/redeemable';
import {
  IconClock,
  IconAt,
  IconCoin,
  IconUser,
  IconLego,
  IconTrash,
} from '@tabler/icons-react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'mantine-react-table';

interface Props {
  transactions: TransactionWithUserAndRedeemable[];
}

export default function TransactionTable({ transactions }: Props) {
  const columns = useMemo<MRT_ColumnDef<TransactionWithUserAndRedeemable>[]>(
    () => [
      {
        header: 'Redeemable',
        accessorFn: (row) => row.redeemable.name,
        enableEditing: false,
      },
      {
        header: 'User',
        accessorFn: (row) =>
          `${row.attendee.user.firstName} ${row.attendee.user.lastName}`,
        enableEditing: false,
      },
      {
        header: 'Email',
        accessorFn: (row) => row.attendee.user.email,
        enableEditing: false,
      },
      {
        header: 'Quantity',
        accessorFn: (row) => row.quantity,
        enableEditing: false,
      },
      {
        header: 'Timestamp',
        accessorFn: (row) => row.transactedAt.toLocaleString(),
        enableEditing: false,
      },
    ],
    []
  );

  const [data, setData] = useState<TransactionWithUserAndRedeemable[]>(
    () => transactions
  );

  const openDeleteConfirmModal = async (
    row: MRT_Row<TransactionWithUserAndRedeemable>
  ) => {
    return modals.openConfirmModal({
      title: 'Are you sure you want to delete this transaction?',
      children: (
        <div className='grid grid-cols-[20px_auto] gap-2'>
          <div className='col-start-1'>
            <IconLego width={20} color='#5f6ef5' />
          </div>
          <h1>{row.original.redeemable.name}</h1>

          <div className='col-start-1'>
            <IconCoin
              width={20}
              color={row.original.quantity > 0 ? '#5ff573' : '#f55f64'}
            />
          </div>
          <h1>{row.original.quantity}</h1>

          <div className='col-start-1'>
            <IconUser width={20} color='#995ff5' />
          </div>
          <h1>
            {row.original.attendee.user.firstName}{' '}
            {row.original.attendee.user.lastName}
          </h1>

          <div className='col-start-1'>
            <IconAt width={20} color='#fcba03' />
          </div>
          <h1>{row.original.attendee.user.email}</h1>

          <div className='col-start-1'>
            <IconClock width={20} color='#99ffeb' />
          </div>
          <h1>{row.original.transactedAt.toLocaleString()}</h1>
        </div>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const resp = await deleteTransaction(row.original.id);
          if (resp.status === 204) {
            notifications.show({
              color: 'green',
              title: 'Success!',
              message: 'Transaction deleted successfully.',
            });
            setData((prev) => prev.filter((r, _) => r.id !== row.original.id));
          } else {
            notifications.show({
              color: 'red',
              title: 'Error deleting transaction',
              message: resp.statusText,
            });
          }
        } catch (e) {
          console.error(e);
          notifications.show({
            color: 'red',
            title: 'An unknown error occurred.',
            message: 'Check console for more info.',
          });
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
        color='red'
        onClick={() => openDeleteConfirmModal(row)}
        styles={{
          root: { '--button-padding-x': '3px', '--button-height': '32px' },
        }}
      >
        <IconTrash color='white' />
      </Button>
    ),
  });

  return <MantineReactTable table={table} />;
}
