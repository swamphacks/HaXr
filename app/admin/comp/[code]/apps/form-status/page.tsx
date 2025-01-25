'use client';

import { markFormsAsCompleted } from '@/actions/applications';
import { Box, Button, Center, Space, Stack, Textarea } from '@mantine/core';
import { Form, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface Props {
  params: {
    code: string;
  };
}
export default function FormStatus({ params: { code } }: Props) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      applicationIds: '',
    },
  });

  return (
    <Form
      form={form}
      onSubmit={async (values) => {
        const applicationIds: string[] = values.applicationIds.split('\n');

        const notId = notifications.show({
          title: 'Marking as Completed',
          message: 'Marking form as completed...',
        });

        if (await markFormsAsCompleted(applicationIds)) {
          notifications.update({
            id: notId,
            title: 'Marked as Completed',
            message: 'Applications marked as completed',
            color: 'green',
          });
        } else {
          notifications.update({
            id: notId,
            title: 'Error',
            message: 'Error marking applications as completed',
            color: 'red',
          });
        }
      }}
    >
      <Stack>
        <Textarea
          label='Participant IDs'
          placeholder='Paste participant IDs, one per line, here'
          key={form.key('applicationIds')}
          {...form.getInputProps('applicationIds')}
          required
          withAsterisk
          rows={10}
          resize='vertical'
        />

        <Button type='submit' variant='outline' color='blue'>
          Mark as Completed
        </Button>
      </Stack>
    </Form>
  );
}
