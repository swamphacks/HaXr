import { profileSchema } from '@/schemas/profile';
import schoolData from '@/public/data/schools.json';
import {
  Alert,
  Anchor,
  Autocomplete,
  Avatar,
  Button,
  Fieldset,
  Group,
  InputBase,
  Loader,
  LoadingOverlay,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { useForm, Form, yupResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IMaskInput } from 'react-imask';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconCheck,
  IconFileUpload,
  IconNotesOff,
  IconX,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';
import { updateUserAvatar, updateUserProfile } from '@/actions/user';

export type EditableUser = Pick<
  User,
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'school'
  | 'bio'
  | 'githubURL'
  | 'linkedinURL'
  | 'skills'
>;

const stripUser = (user: User | null): EditableUser | null => {
  if (!user) return null;

  const {
    firstName,
    lastName,
    phone,
    school,
    bio,
    githubURL,
    linkedinURL,
    skills,
  } = user;
  return {
    firstName: firstName || '',
    lastName: lastName || '',
    phone: phone || '',
    school: school || '',
    bio: bio || '',
    githubURL: githubURL || '',
    linkedinURL: linkedinURL || '',
    skills: skills || '',
  };
};

export default function Account() {
  // Retrieve session
  const { data: session, update } = useSession();

  // Check if session, if not redirect to /
  if (!session || !session.user) redirect('/');

  // Form processing states
  const [processing, setProcessing] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  // Avatar states, loading, and values
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState<boolean>(false);
  const MAX_IMAGE_SIZE_MB = 4.5;
  const MAX_FILE_SIZE_BYTES = 1000000 * MAX_IMAGE_SIZE_MB;

  // Form initilization
  const form = useForm<EditableUser>({
    mode: 'uncontrolled',
    initialValues: stripUser(session.user) ?? undefined,
    validate: yupResolver(profileSchema),
    onValuesChange: (values: EditableUser) => {
      setDirty(true);
    },
    transformValues: (values: EditableUser) => {
      if (values.phone) values.phone = values.phone.replace(/\D/g, '');

      return values;
    },
  });

  const onSubmit = async (values: EditableUser) => {
    if (!session.user.id) {
      console.error('Cannot submit form without session ID.');
      notifications.show({
        color: 'red',
        title: 'Oops! Something went wrong.',
        message:
          'A technical error has occurred. Please contact a member of the technical team for assistance.',
        icon: <IconX />,
        autoClose: 3000,
      });
      return;
    }

    setProcessing(true);

    const notificationId = notifications.show({
      title: 'Updating Profile',
      message: 'Please wait while we update your profile.',
      loading: true,
      autoClose: false,
    });

    const newUser = await updateUserProfile(session.user.id, values);

    if (!newUser) {
      notifications.update({
        id: notificationId,
        color: 'red',
        title: 'Oops! Something went wrong.',
        message:
          'A technical error has occurred. Please contact a member of the technical team for assistance.',
        icon: <IconX />,
        loading: false,
        autoClose: 3000,
      });
      setProcessing(false);
      return;
    }

    await update({
      ...session,
      user: newUser,
    });

    setProcessing(false);
    setDirty(false);
    notifications.update({
      id: notificationId,
      color: 'green',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully.',
      icon: <IconCheck />,
      autoClose: 3000,
      loading: false,
    });
  };

  const onUploadAvatar = async (event: any) => {
    event.preventDefault();

    if (!session?.user?.id) {
      notifications.show({
        title: 'Oops! Something went wrong.',
        message:
          'A technical error has occurred. Please contact a member of the technical team for assistance.',
        icon: <IconX />,
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    if (!inputFileRef.current?.files) {
      notifications.show({
        title: 'No file selected',
        message: 'No file has been selected. Please try again!',
        icon: <IconX />,
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    const file = inputFileRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      notifications.show({
        title: 'Avatar Update Failed',
        message:
          'Your Avatar image size is too big! Please keep the file size less than 5MB.',
        icon: <IconX />,
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    setLoadingAvatar(true);

    const updatedUserData = await updateUserAvatar(session.user.id, formData);

    if (!updatedUserData) {
      notifications.show({
        title: 'Avatar Update Failed',
        message: 'Your Avatar has not been updated successfully!',
        icon: <IconX />,
        color: 'red',
        autoClose: 3000,
      });
      setLoadingAvatar(false);
      return;
    }

    await update({
      ...session,
      user: updatedUserData,
    });

    notifications.show({
      title: 'Avatar Updated',
      message: (
        <Text size='sm'>
          Your avatar updated successfully. You may need to{' '}
          <Anchor href=''>refresh</Anchor> to see the changes.
        </Text>
      ),
      icon: <IconCheck />,
      color: 'green',
      autoClose: 3000,
    });

    setLoadingAvatar(false);
  };

  return (
    <Stack w='100%' h='100%' pr={20} pl={20} pos='relative'>
      <Form form={form} onSubmit={onSubmit}>
        <Stack justify='center' align='center'>
          <Fieldset legend='Public Profile' disabled={processing}>
            <Stack align='center'>
              <Group
                className='relative h-fit w-fit rounded-full hover:cursor-pointer'
                justify='center'
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
                onClick={() => {
                  if (!loadingAvatar) inputFileRef.current?.click();
                }}
              >
                <Avatar
                  src={session?.user?.image}
                  size={100}
                  className={
                    isAvatarHovered || loadingAvatar ? 'opacity-20' : ''
                  }
                />
                {isAvatarHovered && !loadingAvatar && (
                  <Tooltip
                    bg='dark'
                    color='white'
                    label='Click to upload Avatar'
                  >
                    <IconFileUpload size='50%' className='absolute' />
                  </Tooltip>
                )}
                {loadingAvatar && <Loader size={40} className='absolute' />}
                <input
                  type='file'
                  ref={inputFileRef}
                  className='hidden'
                  accept='image/*'
                  onChange={onUploadAvatar}
                />
              </Group>
              <Group wrap='nowrap'>
                <TextInput
                  required
                  label='First Name'
                  placeholder='Albert'
                  key={form.key('firstName')}
                  {...form.getInputProps('firstName')}
                />
                <TextInput
                  required
                  label='Last Name'
                  placeholder='Gator'
                  key={form.key('lastName')}
                  {...form.getInputProps('lastName')}
                />
              </Group>
              <Autocomplete
                label='School'
                w='100%'
                placeholder='Ex. University of Florida'
                data={schoolData.schools}
                key={form.key('school')}
                {...form.getInputProps('school')}
              />

              <Stack w='100%' gap={2}>
                <Textarea
                  label='Bio'
                  key={form.key('bio')}
                  placeholder='Ex. First Year CS @ UF'
                  w='100%'
                  autosize
                  minRows={3}
                  maxRows={7}
                  maxLength={1000}
                  {...form.getInputProps('bio')}
                />
              </Stack>

              <TagsInput
                w='100%'
                label='Skills'
                placeholder='Enter skills here...'
                splitChars={[]}
                maxTags={15}
                key={form.key('skills')}
                {...form.getInputProps('skills')}
              />

              <TextInput
                leftSection={<IconBrandGithub />}
                label='GitHub URL'
                key={form.key('githubURL')}
                placeholder='https://github.com/albertgator'
                {...form.getInputProps('githubURL')}
                w='100%'
              />

              <TextInput
                leftSection={<IconBrandLinkedin />}
                label='LinkedIn URL'
                placeholder='https://linkedin.com/in/albertgator'
                key={form.key('linkedinURL')}
                {...form.getInputProps('linkedinURL')}
                w='100%'
              />
            </Stack>
          </Fieldset>

          <Fieldset legend='Account' w='100%' disabled={processing}>
            <Stack>
              <Tooltip
                label='You cannot change your email.'
                color='gray'
                position='top-start'
              >
                <TextInput
                  required
                  label='Email'
                  placeholder={session?.user?.email}
                  disabled
                />
              </Tooltip>
              <InputBase
                label='Phone'
                key={form.key('phone')}
                placeholder='Ex. (314)-952-6281'
                component={IMaskInput}
                mask='(000)-000-0000'
                {...form.getInputProps('phone')}
              />
            </Stack>
          </Fieldset>
          <Stack w='95%' gap={10}>
            {dirty && (
              <Alert
                title='Changes have not been saved'
                radius='md'
                color='red.6'
                icon={<IconNotesOff />}
              ></Alert>
            )}
            <Text size='xs'>
              By clicking submit, you agree to SwampHacks&apos;s{' '}
              <Anchor>Term&apos;s of Service</Anchor>,{' '}
              <Anchor>Privacy Policy</Anchor>, and{' '}
              <Anchor>Community Guidelines</Anchor>.
            </Text>
            <Button fullWidth type='submit' disabled={processing || !dirty}>
              Save Profile
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Stack>
  );
}
