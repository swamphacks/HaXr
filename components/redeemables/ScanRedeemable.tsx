'use client';

import { useCallback, useState, useMemo } from 'react';
import { Redeemable, User } from '@prisma/client';
import { modals } from '@mantine/modals';
import { Button } from '@mantine/core';
import { LoadingOverlay, Select, NumberInput, Stack } from '@mantine/core';
import {
  IconScan,
  IconUser,
  IconCoin,
  IconLego,
  IconGavel,
  IconAt,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { GetAttendeesResponse } from '@/types/application';
import { onTransactionConfirm } from '@/utils/redeemable';
import { notifications } from '@mantine/notifications';
import { getAttendeeByBadgeId } from '@/actions/applications';
import QrScanner from '@/components/scan/QrScanner';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';

const actions = ['Redeem', 'Grant'];

interface Props {
  compCode: string;
  attendees: Required<GetAttendeesResponse>[];
  redeemables: Redeemable[];
  name?: string;
}

export default function ScanRedeemable({
  compCode,
  attendees,
  redeemables,
  name,
}: Props) {
  const [visible, { open, close }] = useDisclosure(false);
  const [redeemableName, setRedeemableName] = useState<string | null>(
    redeemables.find((r) => r.name === name)?.name ?? null
  );
  const [quantity, setQuantity] = useState<number | null>(1);
  const [action, setAction] = useState<string | null>(actions[0]);

  const openConfirmModal = useCallback(
    (user: User) => {
      if (!redeemableName || !quantity || !action) {
        notifications.show({
          color: 'red',
          title: 'Missing fields',
          message: 'Please select a redeemable, quantity, and action',
        });
        return;
      }

      modals.openConfirmModal({
        title: 'Confirm Transaction',
        children: (
          <div className='grid grid-cols-[20px_auto] gap-2'>
            <div className='col-start-1'>
              <IconLego strokeWidth={2} width={20} color='#5f6ef5' />
            </div>
            <h1>{redeemableName}</h1>

            <div className='col-start-1'>
              <IconGavel strokeWidth={2} width={20} color='#f5a35f' />
            </div>
            <h1>{action}</h1>

            <div className='col-start-1'>
              <IconCoin
                width={20}
                color={action === 'Grant' ? '#5ff573' : '#f55f64'}
              />
            </div>
            <h1>{quantity}</h1>

            <div className='col-start-1'>
              <IconUser width={20} color='#995ff5' />
            </div>
            <h1>{`${user.firstName} ${user.lastName}`}</h1>

            <div className='col-start-1'>
              <IconAt width={20} color='#fcba03' />
            </div>
            <h1>{user.email}</h1>
          </div>
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
    },
    [compCode, redeemableName, action, quantity]
  );

  const onScan = useCallback(
    async (qrCode: string) => {
      open();

      const attendee = await getAttendeeByBadgeId(qrCode, compCode);
      if (!attendee) {
        notifications.show({
          title: 'Invalid Badge',
          message: 'This code does not belong to any attendee',
          color: 'red',
        });
      } else openConfirmModal(attendee.user);

      close();
    },
    [compCode, open, close, openConfirmModal]
  );

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

  const table = useMantineReactTable({
    columns,
    data: attendees,
    enableEditing: false,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Button
        color='green'
        onClick={() => openConfirmModal(row.original.user)}
        disabled={!redeemableName || !quantity || !action}
        styles={{
          root: { '--button-padding-x': '3px', '--button-height': '32px' },
        }}
      >
        <IconScan color='white' />
      </Button>
    ),
  });

  return (
    <div className='flex flex-col gap-4'>
      <Stack align='center'>
        <div className='flex w-full max-w-[500px] flex-col gap-4'>
          <Select
            label='Redeemable'
            placeholder='Select Redeemable'
            data={redeemables.map((r) => r.name)}
            defaultValue={redeemableName ?? undefined}
            onChange={(value) => setRedeemableName(value)}
            required={true}
          />
          <div className='grid grid-cols-2 gap-4'>
            <Select
              label='Action'
              placeholder='Select Action'
              data={actions}
              onChange={(value) => setAction(value)}
              defaultValue={actions[0]}
              required={true}
            />
            <NumberInput
              label='Quantity'
              defaultValue={1}
              min={1}
              onChange={(value) =>
                setQuantity(typeof value === 'number' ? value : parseInt(value))
              }
              required={true}
            />
          </div>
        </div>
      </Stack>

      <Stack align='center'>
        <LoadingOverlay
          visible={visible}
          overlayProps={{ radius: 'sm', blur: 3 }}
        />
        <QrScanner onScan={onScan} rememberAs='redeemable-scanner' />
      </Stack>

      <MantineReactTable table={table} />
    </div>
  );
}
