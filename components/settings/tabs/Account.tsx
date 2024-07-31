import {
  updateUserProfile,
  updateUserAvatar,
  deleteUserAvatar,
} from '@/actions/user';
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
  Tooltip,
} from '@mantine/core';
import { useForm, Form, yupResolver } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconCheck,
  IconFileUpload,
  IconX,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';

export default function Account() {
  const { data: session, status, update } = useSession();
  const [visible, { toggle, open, close }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: 50em)`);
  const [isHovered, setIsHovered] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      bio: session?.user?.bio
    },
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
            <Stack align='center'>
              <Group
                className='relative h-fit w-fit rounded-full hover:cursor-pointer'
                justify='center'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => inputFileRef.current?.click()}
              >
                <Avatar
                  src={session?.user?.image}
                  size={100}
                  className={isHovered ? 'opacity-30' : ''}
                />
                {isHovered ? (
                  <Tooltip
                    bg='dark'
                    color='white'
                    label='Click to upload Avatar'
                  >
                    <IconFileUpload size='50%' className='absolute' />
                  </Tooltip>
                ) : (
                  <></>
                )}
                <input
                  type='file'
                  ref={inputFileRef}
                  className='hidden'
                  accept='image/*'
                  onChange={async (event) => {
                    event.preventDefault();

                    if (!inputFileRef.current?.files)
                      throw new Error('No file selected!');

                    const file = inputFileRef.current.files[0];

                    if (file.size > 102400) {
                      notifications.show({
                        message:
                          'Your Avatar image size is too big! Keep it less than 100KB.',
                        icon: <IconX />,
                        color: 'red',
                        title: 'Avatar Update Failed',
                        autoClose: 3000,
                      });
                      return;
                    }

                    const newBlob = await upload(file.name, file, {
                      access: 'public',
                      handleUploadUrl: '/api/avatar/upload',
                    });

                    if (newBlob) console.log('Uploaded success');

                    if (!session?.user?.id) {
                      console.error(
                        '[ERROR] No session ID. Please contact Technical Staff for help'
                      );
                      return;
                    }

                    await deleteUserAvatar(session.user.id);

                    const user = await updateUserAvatar(
                      session?.user?.id,
                      newBlob.url
                    );

                    if (user !== null) {
                      await update({
                        ...session,
                        user: user,
                      });

                      notifications.show({
                        message: 'Your Avatar has updated successfully!',
                        icon: <IconCheck />,
                        color: 'green',
                        title: 'Avatar Updated',
                        autoClose: 3000,
                      });
                    } else {
                      notifications.show({
                        message:
                          'Your Avatar has not been updated successfully!',
                        icon: <IconX />,
                        color: 'red',
                        title: 'Avatar Update Failed',
                        autoClose: 3000,
                      });
                    }
                  }}
                />
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
                key={form.key('bio')}
                description='(optional)'
                placeholder='Ex. First Year CS @ UF'
                w='100%'
                autosize
                minRows={3}
                maxRows={7}
                {...form.getInputProps('bio')}
              />

              <TextInput
                leftSection={<IconBrandGithub />}
                label='Github URL'
                key={form.key('githubURL')}
                placeholder={session?.user?.githubURL || ''}
                {...form.getInputProps('linkedinURL')}
                w='100%'
              />

              <TextInput
                leftSection={<IconBrandLinkedin />}
                label='Linkedin URL'
                key={form.key('linkedinURL')}
                placeholder={session?.user?.linkedinURL || ''}
                {...form.getInputProps('linkedinURL')}
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
