import {
  updateUserProfile,
  updateUserAvatar,
  deleteUserAvatar,
} from '@/actions/user';
import { profileConfigurationScheme } from '@/schemas';
import {
  Alert,
  Anchor,
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
  IconCheckbox,
  IconFileUpload,
  IconNotesOff,
  IconX,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';

interface FormValues {
  firstName?: string;
  lastName?: string;
  phone?: string;
  school?: string;
  bio?: string;
  githubURL?: string;
  linkedinURL?: string;
  skills: string[];
}

export default function Account() {
  // Component level states
  const { data: session, status, update } = useSession();
  const [isLoading, { open, close }] = useDisclosure();

  // Avatar states, loading, and values
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [loadingAvatar, setLoadingAvatar] = useState<boolean>(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState<boolean>(false);
  const MAX_IMAGE_SIZE_MB = 4.5;
  const MAX_FILE_SIZE_BYTES = 1000000 * MAX_IMAGE_SIZE_MB;

  // Form states for editables
  const [bioLength, setBioLength] = useState<number>(
    session?.user?.bio?.length || 0
  );
  const [currentSkills, setCurrentSkills] = useState<string[]>(
    session?.user?.skills || []
  );
  const [currentSkillError, setcurrentSkillError] = useState<boolean>(false);
  const [formChanged, setFormChanged] = useState<boolean | null>(null);

  const displayPhone = (phone: string) => {
    if (!phone || phone.length !== 10) return null;

    return `(${phone.slice(0, 3)})-${phone.slice(3, 6)}-${phone.slice(6)}`;
  };

  // Form initilization
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      bio: session?.user?.bio || '',
      skills: currentSkills,
    },
    validate: yupResolver(profileConfigurationScheme),
    onValuesChange: (values: any) => {
      console.log(values);
      if (values.bio !== null) setBioLength(values.bio.length);
      setFormChanged(true);
    },
  });

  // Preprocessing form values after submit
  const cleanFormValues = (values: FormValues): Partial<FormValues> => {
    const cleanedEntries = Object.entries(values).map(([key, value]) => {
      if (key === 'phone' && typeof value === 'string') {
        // Filter pure numbers out of phone number
        const cleanedPhone = value.replace(/\D/g, '');
        return [key, cleanedPhone];
      }

      if (Array.isArray(value)) {
        // Leave untouched
        return [key, value];
      }

      if (typeof value === 'string' && value.trim() === '') {
        // Label empty strings as null for removal later
        return null;
      }

      return [key, value];
    });

    // Filter out null entries (those that were empty strings)
    return Object.fromEntries(cleanedEntries.filter((entry) => entry !== null));
  };

  // Submitting Form
  const onSubmitForm = async (values: any) => {
    open();

    if (!session?.user?.id) {
      console.error(
        '[ERROR] No session ID. Please contact Technical Staff for help'
      );
      close();
      return;
    }

    values = cleanFormValues(values);
    console.log(values);
    const newUserData = await updateUserProfile(session?.user?.id, values);

    if (newUserData) {
      // Updating session to reflect new user
      await update({
        ...session,
        user: newUserData,
      });

      // Form resetting and state resetting
      form.reset();
      form.setFieldValue('bio', newUserData.bio || '');
      setBioLength(newUserData.bio?.length! || 0);
      setCurrentSkills(newUserData.skills);
      setFormChanged(false);
      setcurrentSkillError(false);

      notifications.show({
        message: (
          <Text size='sm'>
            Your profile updated successfully. You may need to{' '}
            <Anchor href=''>refresh</Anchor> to see the changes.
          </Text>
        ),
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

  const onUploadAvatar = async (event: any) => {
    event.preventDefault();

    if (session?.user?.id === undefined) {
      notifications.show({
        title: 'Oops! Something went wrong.',
        message:
          'A technical error has occurred. Please contact a member of the technical team for assistance. (ERR_AUTH_03)',
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
        message: 'Your Avatar image size is too big! Keep it less than 5MB.',
        icon: <IconX />,
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    setLoadingAvatar(true);

    await deleteUserAvatar(session.user.id);
    const updatedUserData = await updateUserAvatar(
      session?.user?.id!,
      formData
    );

    if (updatedUserData) {
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
    } else {
      notifications.show({
        title: 'Avatar Update Failed',
        message: 'Your Avatar has not been updated successfully!',
        icon: <IconX />,
        color: 'red',
        autoClose: 3000,
      });
    }

    setLoadingAvatar(false);
  };

  return (
    <Stack w='100%' h='100%' pr={20} pl={20} pos='relative'>
      <Form form={form} onSubmit={onSubmitForm}>
        <Stack justify='center' align='center'>
          <Fieldset legend='Public Profile'>
            <LoadingOverlay visible={isLoading || status === 'loading'} />
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
              <Stack w='100%' gap={2}>
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
                <Text size='xs' c={bioLength <= 500 ? 'gray' : 'red.7'}>
                  Characters: {bioLength}/500.
                </Text>
              </Stack>

              <TagsInput
                w='100%'
                label='Skills'
                placeholder='Type here and hit enter...'
                value={currentSkills}
                splitChars={[]}
                maxTags={15}
                error={
                  currentSkillError
                    ? 'Do not enter skills with more than 15 characters.'
                    : false
                }
                onOptionSubmit={(value: string) => {
                  if (value.length > 15) {
                    setcurrentSkillError(true);
                    return;
                  }
                  setcurrentSkillError(false);

                  form.setFieldValue('skills', [...currentSkills, value]);
                  setCurrentSkills((prev) => [...prev, value]);
                }}
                onRemove={(value: string) => {
                  form.setFieldValue(
                    'skills',
                    currentSkills.filter((skill) => skill !== value)
                  );
                  setCurrentSkills((prev) =>
                    prev.filter((skill) => skill !== value)
                  );
                }}
              />

              <TextInput
                leftSection={<IconBrandGithub />}
                label='Github URL'
                key={form.key('githubURL')}
                placeholder={session?.user?.githubURL || ''}
                {...form.getInputProps('githubURL')}
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
              <InputBase
                label='Phone'
                key={form.key('phone')}
                placeholder={
                  displayPhone(session?.user?.phone!) || 'Ex. (433)-897-1123'
                }
                component={IMaskInput}
                mask='(000)-000-0000'
                {...form.getInputProps('phone')}
              />
            </Stack>
          </Fieldset>
          <Stack w='95%' gap={10}>
            {formChanged !== null && (
              <Alert
                title={
                  formChanged
                    ? 'Changes have not been saved.'
                    : 'Changes saved.'
                }
                radius='md'
                color={formChanged ? 'red.6' : 'green.6'}
                icon={formChanged ? <IconNotesOff /> : <IconCheckbox />}
              ></Alert>
            )}
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
