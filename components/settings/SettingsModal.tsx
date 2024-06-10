import {
  Avatar,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconBellRinging,
  IconBrush,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React from 'react';

interface SettingsProps {
  opened: boolean;
}

export default function SettingsModal({ opened }: SettingsProps) {
  const iconStyle = { width: rem(20), height: rem(20) };
  const { data: session, status } = useSession();

  const profileForm = useForm({
    mode: 'uncontrolled',
    initialValues: {
      user: {
        firstName: session?.user?.firstName,
        lastName: session?.user?.lastName,
      },
    },
    validate: {
      user: {
        firstName: (value) => (value !== '' ? null : 'Invalid first name'),
        lastName: (value) => (value !== '' ? null : 'Invalid last name'),
      },
    },
  });

  if (session?.user) {
    profileForm.setFieldValue('user.firstName', session.user.firstName || '');
    profileForm.setFieldValue('user.lastName', session.user.lastName || '');
  }

  return (
    <Modal opened={opened} onClose={() => {}} size='auto'>
      <Tabs orientation='vertical' defaultValue='public'>
        <Tabs.List>
          <Tabs.Tab value='public' leftSection={<IconUser style={iconStyle} />}>
            Public Profile
          </Tabs.Tab>

          <Tabs.Tab
            value='account'
            leftSection={<IconSettings style={iconStyle} />}
          >
            Account
          </Tabs.Tab>

          <Tabs.Tab
            value='notifications'
            leftSection={<IconBellRinging style={iconStyle} />}
          >
            Notifications
          </Tabs.Tab>

          <Tabs.Tab
            value='appearance'
            leftSection={<IconBrush style={iconStyle} />}
          >
            Appearance
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='public'>
          <form
            onSubmit={profileForm.onSubmit((values) => console.log(values))}
          >
            <Stack w='100%' h='100%' pr={20} pl={20}>
              <Title order={2}>Public Profile</Title>
              <Divider />
              <Group>
                <TextInput
                  label='First Name'
                  placeholder='John'
                  key={profileForm.key('user.firstName')}
                  {...profileForm.getInputProps('user.firstName')}
                />
                <TextInput
                  label='Last Name'
                  placeholder='Smith'
                  key={profileForm.key('user.lastName')}
                  {...profileForm.getInputProps('user.lastName')}
                />

                <Avatar
                  src={session?.user?.image}
                  ml={rem(30)}
                  size={rem(140)}
                  alt='User Image'
                />
              </Group>

              <Button type='submit'>Submit</Button>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value='account'>
          <Stack w='100%' h='100%' pr={20} pl={20}>
            <Title order={2}>Account</Title>
            <Divider />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value='notifications'>
          <Stack w='100%' h='100%' pr={20} pl={20}>
            <Title order={2}>Notifications</Title>
            <Divider />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value='appearance'>
          <Stack w='100%' h='100%' pr={20} pl={20}>
            <Title order={2}>Appearance</Title>
            <Divider />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
