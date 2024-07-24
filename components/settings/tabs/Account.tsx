import { updateUserProfile } from '@/actions/user';
import { profileConfigurationScheme } from '@/schemas';
import {
  Anchor,
  Avatar,
  Button,
  Fieldset,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm, Form, yupResolver } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconFileUpload, IconX } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function Account() {
  const { data: session, status, update } = useSession();
  const [visible, { toggle, open, close }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: 50em)`);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {},
    validate: yupResolver(profileConfigurationScheme),
    onValuesChange: (values: any) => {
      console.log(values);
    },
  });

  const onSubmit = async (values: any) => {
    if (!session?.user?.id) {
      console.error(
        '[ERROR] No session ID. Please contact Technical Staff for help'
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

      form.reset();

      notifications.show({
        message: 'Your profile has updated successfully!',
        icon: <IconCheck />,
        color: 'green',
        title: 'Public Profile Updated',
        autoClose: 3000,
      });
    } else {
      notifications.show({
        message: 'Your profile has not been updated successfully!',
        icon: <IconX />,
        color: 'red',
        title: 'Public Profile Update Failed',
        autoClose: 3000,
      });
    }

    close();
  };

  return (
    <Stack w='100%' h='100%' pr={20} pl={20}>
      <Form form={form} onSubmit={onSubmit}>
        <Stack justify='center' align='center'>
          <Fieldset legend='Public Profile'>
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
            </Stack>
          </Fieldset>

          <Fieldset legend='Account' w='100%'>
            <Stack>
              <Tooltip
                label='You cannot change your email.'
                color='gray'
                position='top-start'
              >
                <TextInput
                  label='Email'
                  key={form.key('email')}
                  placeholder={session?.user?.email || ''}
                  {...form.getInputProps('email')}
                  disabled
                />
              </Tooltip>
              <TextInput
                label='Phone'
                key={form.key('phone')}
                placeholder={session?.user?.phone || 'Ex. (314)-000-0101'}
                {...form.getInputProps('phone')}
              />
            </Stack>
          </Fieldset>
          <Stack w='95%' gap={10}>
            <Text size='xs'>
              By clicking submit, you agree to Swamphacks&apos;s{' '}
              <Anchor>Term&apos;s of Service</Anchor>,{' '}
              <Anchor>Privacy Policy</Anchor>, and{' '}
              <Anchor>Community Guidelines</Anchor>.
            </Text>
            <Button fullWidth type='submit'>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Stack>
  );
}
