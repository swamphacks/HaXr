'use client';
import { getCompetition } from '@/actions/competition';
import schoolData from '@/public/data/schools.json';
import Spinner from '@/components/Spinner';
import {
  Paper,
  Container,
  Title,
  Stack,
  Fieldset,
  Group,
  TextInput,
  Select,
  Autocomplete,
  Checkbox,
  MultiSelect,
  Button,
  FileButton,
  Text,
  Divider,
  Anchor,
  Alert,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Competition, Status } from '@prisma/client';
import { useEffect, useState } from 'react';
import { IconFileUpload } from '@tabler/icons-react';
import { useForm, yupResolver } from '@mantine/form';
import { applicationConfigurationSchema } from '@/schemas';
import { IMaskInput } from 'react-imask';
import { notifications } from '@mantine/notifications';
import { uploadResume } from '@/actions/storage';
import {
  createApplication,
  getApplication,
  setApplicationStatus,
} from '@/actions/applications';
import { useSession } from 'next-auth/react';

export interface HackerApplicationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: string;
  certAge: boolean;
  school: string;
  levelOfStudy: string;
  major: string;
  graduationMonth: string;
  graduationYear: string;
  hackathonExperience: string;
  teamStatus: string;
  tshirtSize: string;
  dietaryRestrictions: string[];
  referralSource: string[];
  photoConsent: boolean;
  inPersonConsent: boolean;
  codeOfConductConsent: boolean;
  resumeUrl: string;
}

export default function HackerApplication({
  params: { code },
}: {
  params: { code: string };
}) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const mobile = useMediaQuery('(max-width: 50em)');
  const { data: session, status } = useSession();

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      age: '',
      certAge: false,
      school: '',
      levelOfStudy: '',
      major: '',
      graduationMonth: '',
      graduationYear: '',
      hackathonExperience: '',
      teamStatus: '',
      tshirtSize: '',
      dietaryRestrictions: [],
      referralSource: [],
      photoConsent: false,
      inPersonConsent: false,
      codeOfConductConsent: false,
    },
    mode: 'uncontrolled',
    validate: yupResolver(applicationConfigurationSchema),
    transformValues: (values) => ({
      ...values,
      // Clean phone number
      phoneNumber: values.phoneNumber.replace(/\D/g, ''),

      // Format name fields
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),

      // Lowercase email
      email: values.email.trim(),
    }),
  });

  // Fetch data on the client side
  useEffect(() => {
    const fetchCompetition = async () => {
      const competitionData = await getCompetition(code);
      setCompetition(competitionData);
    };

    const fetchApplication = async () => {
      if (!session?.user?.id) return;
      const application = await getApplication(code, session.user.id);
      setApplied(application !== null);
      setLoading(false);
    };

    fetchCompetition();
    fetchApplication();
  }, [code, session?.user?.id]);

  const onSubmit = async (values: typeof form.values) => {
    if (!session?.user?.id || !competition?.code) {
      notifications.show({
        title: 'Oops!',
        message:
          "This is embarrassing... we're having trouble processing your application. Please refresh, and try again.",
        color: 'red',
      });
      setProcessing(false);
      return;
    }

    // Check if a file was uploaded
    if (!file) {
      notifications.show({
        title: 'No resume uploaded',
        message:
          'Please upload a resume to submit your application. Make sure it is in PDF format.',
        color: 'red',
      });
      setProcessing(false);
      return;
    }

    // Check that the file is a PDF
    if (file.type !== 'application/pdf') {
      notifications.show({
        title: 'Invalid file format',
        message: 'Please upload a file in PDF format.',
        color: 'red',
      });
      setProcessing(false);
      return;
    }

    // Let's get this show on the road
    setProcessing(true);
    notifications.show({
      title: 'Processing application',
      message: 'Please wait while we process your application...',
      loading: true,
      autoClose: false,
      color: 'blue',
      withCloseButton: false,
      position: 'bottom-top',
    });

    // Upload the resume
    const formData = new FormData();
    formData.append('file', file);

    if (file.size > 4.5 * 1000000) {
      notifications.show({
        title: 'File too large',
        message: 'Please upload a file that is smaller than 4.5MB.',
        color: 'red',
      });
      setProcessing(false);
      return;
    }

    let resumeUrl: string;
    try {
      const result = await uploadResume(
        formData,
        values.firstName,
        values.lastName
      );
      resumeUrl = result.url;
    } catch (error: any) {
      notifications.show({
        title: 'Error uploading resume',
        message: error.message,
        color: 'red',
      });
      setProcessing(false);
      return;
    }

    try {
      await createApplication(
        { ...values, resumeUrl },
        session.user.id,
        competition.code
      );
      await setApplicationStatus(
        session.user.id,
        competition.code,
        Status.APPLIED
      );
      notifications.clean();
      setApplied(true);
    } catch (error) {
      notifications.show({
        title: 'Error submitting application',
        message:
          'An error occurred while submitting your application. Please try again.',
        color: 'red',
      });
    }

    setProcessing(false);
  };

  if (loading) return <Spinner />;

  if (applied) {
    return (
      <Container size={mobile ? 'lg' : 'md'} py={mobile ? 'sm' : 'lg'} w='100%'>
        <Paper p={mobile ? 'sm' : 'xl'}>
          <Stack align='center'>
            <Title className='text-center' mb={20}>
              Application Submitted! 🚀
            </Title>

            <Text size='md' w={mobile ? '90%' : '70%'}>
              Hello {session?.user?.firstName},
            </Text>

            <Text size='md' w={mobile ? '90%' : '70%'}>
              You have a submitted an application for{' '}
              <span className='font-bold'>{competition?.name}</span>. We will be
              reaching out to you shortly with more information. If you have any
              questions, please reach out to us at{' '}
              <span className='font-bold underline'>
                contact@swamphacks.com
              </span>
            </Text>

            <Text size='sm' w={mobile ? '90%' : '70%'} c='cyan'>
              Make sure to keep an eye out on your hacker portal as updates roll
              out regularly. We can&apos;t wait to see you at the event!
            </Text>

            <Anchor mt={80} mr={10} underline='always' href='/hacker'>
              &#8592; Back
            </Anchor>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size={mobile ? 'lg' : 'md'} py={mobile ? 'sm' : 'lg'} w='100%'>
      <Paper p={mobile ? 'sm' : 'xl'}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack align='center'>
            <Title content='center' mb={0}>
              {competition?.name} Application 🐊 🔟
            </Title>
            <Anchor underline='always' href='/hacker'>
              Back to portal
            </Anchor>
            <Stack gap={30} w={mobile ? '100%' : '70%'}>
              <Fieldset legend='Personal Information' disabled={processing}>
                <Stack gap={10}>
                  <Group w='100%' justify='center' align='center'>
                    {/* First and last name */}
                    <TextInput
                      flex={1}
                      label='First Name'
                      placeholder='John'
                      required
                      {...form.getInputProps('firstName')}
                    />
                    <TextInput
                      flex={1}
                      label='Last Name'
                      placeholder='Doe'
                      required
                      {...form.getInputProps('lastName')}
                    />
                  </Group>

                  {/* Email and phone number */}
                  <TextInput
                    label='Email'
                    placeholder='johndoe@roblox.com'
                    required
                    {...form.getInputProps('email')}
                  />
                  <Group>
                    <TextInput
                      flex={1}
                      label='Phone Number'
                      placeholder='(314)-952-6281'
                      required
                      component={IMaskInput}
                      //@ts-ignore
                      // Why doesn't typescript like this :(
                      mask='(000)-000-0000'
                      // @ts-check
                      {...form.getInputProps('phoneNumber')}
                    />
                    <Select
                      required
                      flex={1}
                      label='Age'
                      placeholder='Choose your age'
                      data={[
                        'Under 18',
                        '18',
                        '19',
                        '20',
                        '21',
                        '22',
                        '23',
                        '24',
                        '25+',
                      ]}
                      {...form.getInputProps('age')}
                    />
                  </Group>
                  <Checkbox
                    mt={20}
                    required
                    label='I certify that I will be 18 years old before January 25th, 2025. (Required)'
                    {...form.getInputProps('certAge', { type: 'checkbox' })}
                  />
                </Stack>
              </Fieldset>
              <Fieldset legend='Education' disabled={processing}>
                <Stack gap={10}>
                  {/* What school + Year + Major + Expexted Grad */}
                  <Autocomplete
                    label='School'
                    placeholder='Choose your school'
                    data={schoolData.schools}
                    required
                    {...form.getInputProps('school')}
                  />
                  <Select
                    label='Level of Study'
                    placeholder='Choose your level of study'
                    data={[
                      'Undergraduate (2 year)',
                      'Undergraduate (4 year)',
                      'Graduate (Masters, Professional, Doctoral, etc.)',
                      'Code Bootcamp',
                      'Other',
                    ]}
                    {...form.getInputProps('levelOfStudy')}
                    required
                  />
                  <TextInput
                    label='Major'
                    placeholder='Enter your major'
                    required
                    {...form.getInputProps('major')}
                  />
                  <Group>
                    <Select
                      flex={1}
                      required
                      label='Expected Graduation Month'
                      placeholder='Choose your graduation month'
                      data={[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                      ]}
                      {...form.getInputProps('graduationMonth')}
                    />

                    <Select
                      flex={1}
                      required
                      label='Expected Graduation Year'
                      placeholder='Choose your graduation year'
                      data={[
                        '2025',
                        '2026',
                        '2027',
                        '2028',
                        '2029',
                        '2030',
                        '2031',
                        '2032+',
                      ]}
                      {...form.getInputProps('graduationYear')}
                    />
                  </Group>
                </Stack>
              </Fieldset>
              <Fieldset legend='Extra' disabled={processing}>
                <Stack gap={10}>
                  <Select
                    label='How many hackathons have you participated in?'
                    required
                    placeholder='Select a number'
                    data={[
                      'This is my first time!',
                      '1',
                      '2',
                      '3',
                      '4',
                      '5 or more',
                    ]}
                    {...form.getInputProps('hackathonExperience')}
                  />
                  <Select
                    label='Do you already have a team?'
                    required
                    placeholder='Select an option'
                    data={[
                      "Yes, I'm part of a team",
                      "No, I'm looking for a team",
                      'No, but I have a team in mind',
                      "I'm a lone wolf",
                    ]}
                    {...form.getInputProps('teamStatus')}
                  />
                  <Select
                    label='T-Shirt size?'
                    placeholder='Choose an option (Unisex)'
                    required
                    data={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
                    {...form.getInputProps('tshirtSize')}
                  />
                  <MultiSelect
                    required
                    label='Dietary Resitrictions (If you select other, please reach out to a staff member)'
                    placeholder='Choose your options'
                    data={[
                      'N/A',
                      'Vegetarian',
                      'Vegan',
                      'Gluten Free',
                      'Kosher',
                      'Halal',
                      'Other',
                    ]}
                    {...form.getInputProps('dietaryRestrictions')}
                  />

                  <Text size='sm' fw={700} mt={20}>
                    Please upload a resume to share with our sponsors!
                  </Text>
                  <Text size='xs'>
                    Every hackathon, companies from all over the US attend to
                    find talented individuals like you. By uploading your
                    resume, you ensure that sponsors can view your skills and
                    experiences, increasing your chances of being noticed for
                    exciting opportunities.
                  </Text>
                  <Text size='xs' c='yellow'>
                    We only accept PDFs. Here&apos;s a free{' '}
                    <Anchor
                      href='https://www.adobe.com/acrobat/online/convert-pdf.html'
                      target='_blank'
                    >
                      PDF converter!
                    </Anchor>
                  </Text>
                  <Group mb={20}>
                    <FileButton onChange={setFile} accept='application/pdf'>
                      {(props) => (
                        <Button
                          leftSection={<IconFileUpload size={20} />}
                          {...props}
                        >
                          {file ? `Uploaded ${file.name}` : 'Upload Resume'}
                        </Button>
                      )}
                    </FileButton>
                  </Group>

                  <MultiSelect
                    label='How did you hear about us?'
                    placeholder='Choose an option'
                    required
                    data={[
                      'Instagram',
                      'Discord',
                      'Linkedin',
                      'Word of Mouth',
                      'Website',
                      'Class Announcement',
                      'Other',
                    ]}
                    {...form.getInputProps('referralSource')}
                  />
                </Stack>
              </Fieldset>

              <Divider />

              <Stack gap={10}>
                <Text size='lg' fw={700}>
                  Consent and Agreement
                </Text>

                <Fieldset unstyled disabled={processing}>
                  <Stack gap={10}>
                    <Checkbox
                      required
                      label={
                        <Text size='sm'>
                          I consent to SwampHacks photo and video policy. We
                          will be taking pictures and recording videos
                          throughout the events for promotional use.
                        </Text>
                      }
                      {...form.getInputProps('photoConsent', {
                        type: 'checkbox',
                      })}
                    />

                    <Checkbox
                      required
                      label={
                        <Text size='sm'>
                          By submitting this application, I recognize that
                          SwampHacks is an in-person only event and my in-person
                          attendance is expected if I am offered acceptance. I
                          also recognize that SwampHacks will be providing free
                          meals but will not be covering transportation costs.
                        </Text>
                      }
                      {...form.getInputProps('inPersonConsent', {
                        type: 'checkbox',
                      })}
                    />

                    <Checkbox
                      required
                      label={
                        <Text size='sm'>
                          I acknowledge and agree to adhere to the SwampHacks{' '}
                          <Anchor target='_blank'>Code of Conduct</Anchor> and
                          commit to upholding the values and guidelines set
                          forth to ensure a safe, inclusive, and respectful
                          environment for all participants.
                        </Text>
                      }
                      {...form.getInputProps('codeOfConductConsent', {
                        type: 'checkbox',
                      })}
                    />
                  </Stack>
                </Fieldset>
              </Stack>
              <Group>
                <Button
                  color='green'
                  variant='light'
                  size='lg'
                  type='submit'
                  fullWidth
                  disabled={processing}
                >
                  Submit Application
                </Button>
              </Group>
              {Object.keys(form.errors).length > 0 && (
                <Alert
                  mt={20}
                  title='Some fields are missing or invalid'
                  color='red'
                >
                  {Object.entries(form.errors).map(([key, value]) => (
                    <Text key={key} size='sm'>
                      {value}
                    </Text>
                  ))}
                </Alert>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>
      <Group justify='center' align='center'>
        <Text size='xs' mt={20} mb={0}>
          Made with ❤️ by the SwampHacks Team
        </Text>
      </Group>
    </Container>
  );
}
