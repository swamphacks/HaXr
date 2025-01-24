'use client';

import { useRef, useState } from 'react';
import { Redeemable, Application, Attendee } from '@prisma/client';
import { Select, Flex, NumberInput } from '@mantine/core';
import { GetAttendeesResponse } from '@/types/application';
import AttendeeTable from '@/components/redeemables/AttendeeTable';

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
  const [redeemableName, setRedeemableName] = useState<string | null>(
    redeemables.find((r) => r.name === name)?.name ?? null
  );
  const [quantity, setQuantity] = useState<number | null>(1);
  const [action, setAction] = useState<string | null>(actions[0]);

  return (
    <div className='flex flex-col gap-4'>
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
