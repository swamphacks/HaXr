'use client';

import { useCallback, useState } from 'react';
import { Redeemable, User, Application, Attendee } from '@prisma/client';
import { modals } from '@mantine/modals';
import {
  LoadingOverlay,
  Select,
  Flex,
  NumberInput,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { GetAttendeesResponse } from '@/types/application';
import { onTransactionConfirm } from '@/utils/redeemable';
import AttendeeTable from '@/components/redeemables/AttendeeTable';
import { notifications } from '@mantine/notifications';
import { getAttendeeByBadgeId } from '@/actions/applications';
import QrScanner from '@/components/scan/QrScanner';
import TransactionModal from '@/components/redeemables/TransactionModal';

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
        close();
        return;
      }

      if (!redeemableName || !quantity || !action) {
        notifications.show({
          color: 'red',
          title: 'Missing fields',
          message: 'Please select a redeemable, quantity, and action',
        });
        close();
        return;
      }

      modals.openConfirmModal({
        title: 'Confirm Transaction',
        children: (
          <TransactionModal
            redeemableName={redeemableName}
            action={action}
            quantity={quantity}
            competitionCode={compCode}
            user={attendee.user}
          />
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () =>
          await onTransactionConfirm(
            attendee.user,
            compCode,
            redeemableName,
            action,
            quantity
          ),
      });

      close();
    },
    [compCode, redeemableName, action, quantity, open, close]
  );

  return (
    <div className='flex flex-col gap-4'>
      <Stack align='center'>
        <LoadingOverlay
          visible={visible}
          overlayProps={{ radius: 'sm', blur: 3 }}
        />
        <QrScanner onScan={onScan} rememberAs='redeemable-scanner' />
      </Stack>
      <Select
        label='Redeemable'
        placeholder='Select Redeemable'
        data={redeemables.map((r) => r.name)}
        defaultValue={redeemableName ?? undefined}
        onChange={(value) => setRedeemableName(value)}
        required={true}
      />
      <Flex gap='sm'>
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
      </Flex>

      <AttendeeTable
        compCode={compCode}
        applicants={attendees}
        redeemableName={redeemableName}
        quantity={quantity}
        action={action}
      />
    </div>
  );
}
