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
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function PublicProfile() {
  const { data: session, status } = useSession();

  const profileForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validate: {
      firstName: (value) => (value.trim() !== '' ? null : 'Invalid first name'),
      lastName: (value) => (value.trim() !== '' ? null : 'Invalid last name'),
    },
  });

  // if (session?.user) {
  //   profileForm.setFieldValue('firstName', session.user.firstName);
  //   profileForm.setFieldValue('lastName', session.user.lastName);
  // }

  // Temporary -> to be replaced with loadingOverlay or skeleton from mantine
  if (status === 'loading') {
    return (
      <Stack>
        <Text>Loading</Text>
      </Stack>
    );
  }

  return (
    <form onSubmit={profileForm.onSubmit((values) => console.log(values))}>
      <Stack w='100%' h='100%' pr={20} pl={20}>
        <Title order={2}>Public Profile</Title>
        <Divider />
        <Group>
          <TextInput
            label='First Name'
            placeholder={session?.user?.firstName}
            key={profileForm.key('firstName')}
            {...profileForm.getInputProps('firstName')}
          />
          <TextInput
            label='Last Name'
            placeholder={session?.user?.lastName}
            key={profileForm.key('lastName')}
            {...profileForm.getInputProps('lastName')}
          />

          <Avatar
            src={session?.user?.image}
            className='hover:cursor-pointer hover:brightness-50 hover:filter'
            ml={rem(30)}
            size={rem(100)}
            alt='User Image'
          />
        </Group>

        <Button type='submit' size='md' w='20%'>
          Submit
        </Button>
      </Stack>
    </form>
  );
}
