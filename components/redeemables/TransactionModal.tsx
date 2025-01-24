import { User } from '@prisma/client';
import { IconUser, IconCoin, IconLego, IconGavel } from '@tabler/icons-react';
import { Stack } from '@mantine/core';

interface Props {
  redeemableName: string;
  action: string;
  quantity: number;
  competitionCode: string;
  user: User;
}

export default function TransactionModal({
  redeemableName,
  action,
  quantity,
  user,
}: Props) {
  return (
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
    </div>
  );
}
