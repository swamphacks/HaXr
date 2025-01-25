import { notifications } from '@mantine/notifications';
import { createTransaction } from '@/actions/redeemable';
import { User } from '@prisma/client';

export async function onTransactionConfirm(
  user: User,
  competitionCode: string,
  redeemableName: string,
  action: string,
  quantity: number
) {
  try {
    const resp = await createTransaction({
      competitionCode,
      redeemableName,
      quantity: (action === 'Redeem' ? -1 : 1) * (quantity ?? 1),
      userId: user.id,
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
}
