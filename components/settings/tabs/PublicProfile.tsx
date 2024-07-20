import { updateUserProfile } from '@/actions/user';
import {
  Avatar,
  Button,
  CheckIcon,
  Divider,
  Fieldset,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  rem,
} from '@mantine/core';
import { useForm, Form } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconFileUpload } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function PublicProfile() {
  const { data: session, status, update } = useSession();
  const [ visible, { toggle, open, close }] = useDisclosure();

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
    close();

    // TODO

    // notifications.show({
    //   message: "Your profile has updated successfully!",
    //   icon: <CheckIcon />,
    //   autoClose: 5000
    // })
  };


  return (
    <Stack w='100%' h='100%' pr={20} pl={20}>
      <Title order={2}>Account</Title>
      <Fieldset legend='Public Profile'>
        <Form form={form} onSubmit={onSubmit}>
          <LoadingOverlay visible={visible || status === 'loading'} />
          <Stack>
            <Group>
              <Avatar src={session?.user?.image} size='xl' />
              <Button>
                <IconFileUpload className='mr-1' />
                Upload Image
              </Button>
            </Group>
            <Group wrap='nowrap'>
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
            <Stack>
              <TextInput
                label='School'
                key={form.key('school')}
                placeholder={session?.user?.school || ''}
                {...form.getInputProps('school')}
              />
              <Textarea
                label='Bio'
                description='(optional)'
                placeholder='I like cats and stuff...'
              />
            </Stack>
            <Button type='submit' w='20%' onClick={open}>
              Submit
            </Button>
          </Stack>
        </Form>
      </Fieldset>
    </Stack>
  );
}
