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
  FileInput,
  Input,
  Button,
  FileButton,
  Text,
  Textarea,
  Divider,
  Anchor,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Competition } from '@prisma/client';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { IconFileUpload } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

export default function HackerApplication({
  params: { code },
}: {
  params: { code: string };
}) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const mobile = useMediaQuery('(max-width: 50em)');

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
      tshirtSize: '',
      dietaryRestrictions: [],
      resume: null,
      howDidYouHear: '',
      personalProjectExperience: '',
      inventionImpact: '',
      excitementForHackathon: '',
      projectIdeas: '',
      consentPhotoPolicy: false,
      consentInPersonPolicy: false,
      consentMLH: false,
      consentShareInfoWithMLH: false,
      consentMLHEmails: false,
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? 'First name is required' : null,
      lastName: (value) => (value.length < 2 ? 'Last name is required' : null),
      email: (value) => (/\S+@\S+\.\S+/.test(value) ? null : 'Invalid email'),
      phoneNumber: (value) =>
        value.length < 10 ? 'Invalid phone number' : null,
      certAge: (value) => (!value ? 'You must certify your age' : null),
      school: (value) => (value.length < 2 ? 'School is required' : null),
      levelOfStudy: (value) =>
        value.length < 2 ? 'Level of study is required' : null,
      major: (value) => (value.length < 2 ? 'Major is required' : null),
      graduationMonth: (value) =>
        !value ? 'Graduation month is required' : null,
      graduationYear: (value) =>
        !value ? 'Graduation year is required' : null,
    },
  });

  // Fetch data on the client side
  useEffect(() => {
    const fetchCompetition = async () => {
      const competitionData = await getCompetition(code);
      setCompetition(competitionData);
      setLoading(false);
    };

    fetchCompetition();
  }, [code]);

  if (loading) return <Spinner />;

  return (
    <Container size={mobile ? 'lg' : 'md'} py={mobile ? 'sm' : 'lg'} w='100%'>
      <Paper p={mobile ? 'sm' : 'xl'}>
        <form
          onSubmit={() => {
            console.log('Attempting submit');
          }}
        >
          <Stack align='center'>
            <Title content='center' mb={20}>
              {competition?.name} Application 🐊 🔟
            </Title>
            <Stack gap={30} w={mobile ? '100%' : '70%'}>
              <Fieldset legend='Personal Information'>
                <Stack gap={10}>
                  <Group w='100%' justify='center' align='center'>
                    {/* First and last name */}
                    <TextInput
                      flex={1}
                      label='First Name'
                      placeholder='John'
                      required
                    />
                    <TextInput
                      flex={1}
                      label='Last Name'
                      placeholder='Doe'
                      required
                    />
                  </Group>

                  {/* Email and phone number */}
                  <TextInput
                    label='Email'
                    placeholder='johndoe@roblox.com'
                    required
                  />
                  <Group>
                    <TextInput
                      flex={1}
                      label='Phone Number'
                      placeholder='(314)-952-6281'
                      required
                    />
                    <Select
                      required
                      flex={1}
                      label='Age'
                      placeholder='Choose your age'
                      data={[
                        'Under 18',
                        '18-24',
                        '25-34',
                        '35-44',
                        '45-54',
                        '55-64',
                        '65 or Above',
                      ]}
                    />
                  </Group>
                  <Checkbox
                    mt={20}
                    required
                    label='I certify that I will be 18 years old before January 24th, 2025. (Required)'
                  />
                </Stack>
              </Fieldset>
              <Fieldset legend='Education'>
                <Stack gap={10}>
                  {/* What school + Year + Major + Expexted Grad */}
                  <Autocomplete
                    label='School'
                    placeholder='Choose your school'
                    data={schoolData.schools}
                    required
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
                    required
                  />
                  <TextInput
                    label='Major'
                    placeholder='Choose your major'
                    required
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
                    />
                  </Group>
                </Stack>
              </Fieldset>
              <Fieldset legend='Extra'>
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
                  />
                  <Select
                    label='T-Shirt size?'
                    placeholder='Choose an option (Unisex)'
                    required
                    data={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
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
                  />

                  <Select
                    label='Have you created a personal project before?'
                    placeholder='Choose an option'
                    required
                    data={[
                      'Yes',
                      'No, only school projects',
                      'No, I have never programmed before',
                    ]}
                  />
                </Stack>
              </Fieldset>

              <Fieldset legend="Let's get to know you">
                <Stack gap={10}>
                  <Textarea
                    label='What is a past invention or innovation that has greatly shaped or impacted your life?'
                    required
                    description='This can be anything from a product, service, or even a concept. (1000 characters MAX)'
                    placeholder='Write your response here'
                    autosize
                    minRows={4}
                    maxRows={7}
                    maxLength={1000}
                  />

                  <Textarea
                    label='What are you most excited about for this hackathon?'
                    required
                    description='We want to know what you get excited for so we can bring you more of it! (500 characters MAX)'
                    placeholder='Write your response here'
                    autosize
                    minRows={3}
                    maxRows={5}
                    maxLength={500}
                  />

                  <Textarea
                    label='What projects would you like to work on? (Technical or non-technical)'
                    required
                    description='Give us an idea of what you are passionate about! (1000 characters MAX)'
                    placeholder='Write your response here'
                    autosize
                    minRows={4}
                    maxRows={7}
                    maxLength={1000}
                  />
                </Stack>
              </Fieldset>

              <Divider />

              <Stack gap={10}>
                <Text size='lg' fw={700}>
                  Consent and Agreement
                </Text>

                <Checkbox
                  label={
                    <Text size='sm'>
                      I consent to SwampHacks photo and video policy. We will be
                      taking pictures and recording videos throughout the events
                      for promotional use.
                    </Text>
                  }
                />

                <Checkbox
                  label={
                    <Text size='sm'>
                      By submitting this application, I recognize that
                      SwampHacks is an in-person only event and my in-person
                      attendance is expected if I am offered acceptance. I also
                      recognize that SwampHacks will be providing free meals but
                      will not be covering transportation costs.
                    </Text>
                  }
                />
                <Divider />
                <Stack gap={0} mb={20} mt={20}>
                  <Text size='lg' fw={700}>
                    MLH Policies
                  </Text>
                  <Text size='xs'>
                    We (SWAMPHACKS) are in the process of parterning with MLH
                    (Major League Hacking). The following 3 checkboxes are for
                    this partnerships. If we do not follow through with this
                    partnership your information will NOT be shared.
                  </Text>
                </Stack>

                <Checkbox
                  label={
                    <Text size='sm'>
                      I agree to the{' '}
                      <Anchor href='https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md'>
                        MLH Code of Conduct
                      </Anchor>
                    </Text>
                  }
                />

                <Checkbox
                  label={
                    <Text size='sm'>
                      I authorize you to share my application/registration
                      information with Major League Hacking for event
                      administration, ranking, and MLH administration.
                      Therefore, I agree to the terms of both the{' '}
                      <Anchor href='https://github.com/MLH/mlh-policies/blob/main/contest-terms.md'>
                        MLH Contest Terms and Conditions
                      </Anchor>{' '}
                      and Conditions and the{' '}
                      <Anchor href='https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md'>
                        MLH Privacy Policy
                      </Anchor>
                      .
                    </Text>
                  }
                />

                <Checkbox
                  label={
                    <Text size='sm'>
                      I authorize MLH to send me occasional emails about
                      relevant events, career opportunities, and community
                      announcements. (OPTIONAL)
                    </Text>
                  }
                />
              </Stack>
              <Group>
                <Button
                  color='green'
                  variant='light'
                  size='lg'
                  fullWidth
                  type='submit'
                  onClick={() => alert('Submitted!')}
                >
                  Submit Application
                </Button>
              </Group>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
