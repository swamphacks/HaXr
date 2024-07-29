import { updateUserProfile } from '@/actions/user';
import { profileConfigurationScheme } from '@/schemas';
import { createHash, hash } from 'crypto';
import {
  Anchor,
  Avatar,
  Box,
  Button,
  Center,
  Fieldset,
  Flex,
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
import {
  IconBrandGravatar,
  IconCheck,
  IconFileUpload,
  IconFlagQuestion,
  IconQuestionMark,
  IconX,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';

export default function Account() {
  const { data: session, status, update } = useSession();
  const [visible, { toggle, open, close }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: 50em)`);
  const [isHovered, setIsHovered] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {},
    validate: yupResolver(profileConfigurationScheme),
    onValuesChange: (values: any) => {
      console.log(values);
    },
  });

  const hashEmail = (email: string) => {
    if (!email) return;
    let preEmail = email.trim();
    preEmail = preEmail.toLowerCase();

    const hashedEmail = createHash('sha256').update(preEmail).digest('hex');

    console.log(hashedEmail);
    return `https://gravatar.com/avatar/${hashedEmail}`;
  };

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
            <Stack align='center'>
              <Group
                className='relative h-fit w-fit rounded-full hover:cursor-pointer'
                justify='center'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => window.open('https://gravatar.com', '_blank')}
              >
                <Avatar
                  src={hashEmail(session?.user?.email!)}
                  size={100}
                  className={isHovered ? 'opacity-30' : ''}
                />
                <Tooltip
                  bg='dark'
                  color='white'
                  label={
                    <Text size='xs'>
                      Gravatar is a universal avatar hosting service.<br></br>
                      Please sign up with your Swamphacks account&apos;s email.
                    </Text>
                  }
                >
                  <Box
                    bg='dark'
                    className='absolute bottom-0 right-0 rounded-full p-1'
                  >
                    <IconFlagQuestion size={20} />
                  </Box>
                </Tooltip>
                {isHovered ? (
                  <Tooltip
                    bg='dark'
                    color='white'
                    label='Click to upload Avatar using Gravatar'
                  >
                    <IconBrandGravatar size='50%' className='absolute' />
                  </Tooltip>
                ) : (
                  <></>
                )}
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
              <TextInput
                label='School'
                key={form.key('school')}
                placeholder={session?.user?.school || ''}
                {...form.getInputProps('school')}
                w='100%'
              />
              <Textarea
                label='Bio'
                description='(optional)'
                placeholder='I like cats and stuff...'
                w='100%'
              />
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
