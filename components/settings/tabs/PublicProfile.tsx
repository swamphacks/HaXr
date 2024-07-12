import { updateUserProfile } from '@/actions/user';
import {
  Avatar,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core';
import { useForm, Form } from '@mantine/form';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function PublicProfile() {
  const { data: session, status, update } = useSession();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: session?.user,
  });

  const onSubmit = async (values: any) => {
    console.log(values);

    if (!session?.user?.id) {
      console.error(
        '[ERROR] No session ID. Please contact Technical Staff for'
      );
      return;
    }

    const user = await updateUserProfile(session?.user?.id, values);

    if (user !== null) {
      console.log('Successfully updated!');
      console.log(user);

      await update({
        ...session,
        user: user,
      });
    } else console.log('Unsuccessful');

    form.reset();
  };

  const onDebug = () => {
    console.log('[DEBUG]');
    console.log();
  };

  // Temporary -> to be replaced with loadingOverlay or skeleton from mantine
  if (status === 'loading') {
    return (
      <Stack>
        <Text>Loading</Text>
      </Stack>
    );
  }

  return (
    <Stack w='100%' h='100%' pr={20} pl={20}>
      <Title order={2}>Public Profile</Title>
      <Divider />
      <Form form={form} onSubmit={onSubmit}>
        <Stack>
          <Group justify='center' align='center' gap='md'>
            <Avatar src={session?.user?.image} size='xl' />
            <TextInput
              label='First Name'
              key={form.key('firstName')}
              placeholder={session?.user?.firstName}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label='Last Name'
              key={form.key('lastName')}
              placeholder={session?.user?.lastName}
              {...form.getInputProps('lastName')}
            />
          </Group>

          <Button type='submit' w='20%'>
            Submit
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
}
