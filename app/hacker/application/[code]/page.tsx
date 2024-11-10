'use client';
import Spinner from '@/components/Spinner';
import { useForm } from '@mantine/form';
import {
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  NumberInput,
  Text,
  Stepper,
  Group,
  Radio,
  FileInput,
  MultiSelect,
  Box,
} from '@mantine/core';
import { Competition } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function HackerApplication({
  params: { code },
}: {
  params: { code: string };
}) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      // Personal Info
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: 18,
      gender: '',
      genderCustom: '',

      // Education
      school: '',
      educationLevel: '',
      major: '',
      graduationYear: new Date().getFullYear(),

      // Experience
      hackathonExperience: '',
      previousHackathons: 0,
      skills: [],
      githubUrl: '',
      linkedinUrl: '',
      resume: null,

      // Event Details
      teamPreference: '',
      tshirtSize: '',
      dietaryRestrictions: [],
      dietaryOther: '',
      accommodations: '',

      // Project & Goals
      interests: [],
      projectIdea: '',
      learningGoals: '',

      // Agreements
      mlhCodeOfConduct: false,
      mlhPrivacyPolicy: false,
      mlhEmailConsent: false,
    },

    validate: (values) => {
      if (active === 0) {
        return {
          firstName:
            values.firstName.length < 2 ? 'First name is too short' : null,
          lastName:
            values.lastName.length < 2 ? 'Last name is too short' : null,
          email: /^\S+@\S+$/.test(values.email) ? null : 'Invalid email',
          phone: /^\+?[\d\s-]{10,}$/.test(values.phone)
            ? null
            : 'Invalid phone number',
          age: values.age < 18 ? 'Must be 18 or older' : null,
          gender: !values.gender ? 'Please select gender' : null,
        };
      }

      if (active === 1) {
        return {
          school: !values.school ? 'School is required' : null,
          educationLevel: !values.educationLevel
            ? 'Education level is required'
            : null,
          major: !values.major ? 'Major is required' : null,
          graduationYear: !values.graduationYear
            ? 'Graduation year is required'
            : null,
        };
      }

      if (active === 2) {
        return {
          hackathonExperience: !values.hackathonExperience
            ? 'Experience level is required'
            : null,
          resume: !values.resume ? 'Resume is required' : null,
        };
      }

      return {};
    },
  });

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(`/api/comp/${code}`);
        const data: Competition | null = await response.json();
        setCompetition(data); // Set the state directly here
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [code]);

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    // Handle form submission here
  });

  const nextStep = () => {
    if (form.validate().hasErrors) return;
    setActive((current) => (current < 5 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  if (loading) return <Spinner />;

  return (
    <Container size='md' py='xl'>
      <Paper radius='md' p='xl' withBorder>
        <Title order={2} mb='xl'>
          Hackathon Application
        </Title>

        <Stepper active={active} mb='xl'>
          <Stepper.Step label='Personal' description='Basic information'>
            <Stack gap='md'>
              <Group grow>
                <TextInput
                  required
                  label='First Name'
                  placeholder='John'
                  {...form.getInputProps('firstName')}
                />
                <TextInput
                  required
                  label='Last Name'
                  placeholder='Doe'
                  {...form.getInputProps('lastName')}
                />
              </Group>
              <TextInput
                required
                label='Email'
                placeholder='your@email.com'
                {...form.getInputProps('email')}
              />
              <TextInput
                required
                label='Phone'
                placeholder='+1 234 567 8900'
                {...form.getInputProps('phone')}
              />
              <NumberInput
                required
                label='Age'
                min={16}
                max={100}
                {...form.getInputProps('age')}
              />
              <Radio.Group
                required
                label='Gender'
                {...form.getInputProps('gender')}
              >
                <Stack mt='xs'>
                  <Radio value='male' label='Male' />
                  <Radio value='female' label='Female' />
                  <Radio value='nonBinary' label='Non-binary' />
                  <Radio value='preferNotToSay' label='Prefer not to say' />
                  <Radio value='custom' label='Prefer to self-describe' />
                </Stack>
              </Radio.Group>
              {form.values.gender === 'custom' && (
                <TextInput
                  label='Please describe'
                  {...form.getInputProps('genderCustom')}
                />
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step label='Education' description='Academic details'>
            <Stack gap='md'>
              <TextInput
                required
                label='School'
                placeholder='University name'
                {...form.getInputProps('school')}
              />
              <Select
                required
                label='Education Level'
                placeholder='Select level'
                data={[
                  { value: 'highschool', label: 'High School' },
                  { value: 'undergraduate2', label: 'Undergraduate (2 year)' },
                  { value: 'undergraduate4', label: 'Undergraduate (4 year)' },
                  { value: 'graduate', label: 'Graduate' },
                  { value: 'bootcamp', label: 'Bootcamp' },
                  { value: 'other', label: 'Other' },
                ]}
                {...form.getInputProps('educationLevel')}
              />
              <TextInput
                required
                label='Major/Field of Study'
                {...form.getInputProps('major')}
              />
              <NumberInput
                required
                label='Expected Graduation Year'
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 6}
                {...form.getInputProps('graduationYear')}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label='Experience' description='Skills & background'>
            <Stack gap='md'>
              <Select
                required
                label='Hackathon Experience'
                placeholder='Select experience level'
                data={[
                  { value: 'none', label: 'First Time' },
                  { value: 'beginner', label: '1-2 Hackathons' },
                  { value: 'intermediate', label: '3-5 Hackathons' },
                  { value: 'advanced', label: '5+ Hackathons' },
                ]}
                {...form.getInputProps('hackathonExperience')}
              />
              <MultiSelect
                label='Technical Skills'
                placeholder='Select your skills'
                data={[
                  { value: 'frontend', label: 'Frontend Development' },
                  { value: 'backend', label: 'Backend Development' },
                  { value: 'mobile', label: 'Mobile Development' },
                  { value: 'ui/ux', label: 'UI/UX Design' },
                  { value: 'ml', label: 'Machine Learning' },
                  { value: 'cloud', label: 'Cloud Computing' },
                  { value: 'cybersecurity', label: 'Cybersecurity' },
                ]}
                {...form.getInputProps('skills')}
              />
              <TextInput
                label='GitHub URL'
                placeholder='https://github.com/username'
                {...form.getInputProps('githubUrl')}
              />
              <TextInput
                label='LinkedIn URL'
                placeholder='https://linkedin.com/in/username'
                {...form.getInputProps('linkedinUrl')}
              />
              <FileInput
                required
                label='Resume'
                placeholder='Upload your resume'
                accept='application/pdf'
                {...form.getInputProps('resume')}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label='Event Details' description='Preferences'>
            <Stack gap='md'>
              <Select
                required
                label='Team Preference'
                placeholder='Select preference'
                data={[
                  { value: 'solo', label: 'I want to work solo' },
                  { value: 'team', label: 'I have a team' },
                  { value: 'matching', label: 'I need team matching' },
                ]}
                {...form.getInputProps('teamPreference')}
              />
              <Select
                required
                label='T-Shirt Size'
                placeholder='Select size'
                data={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
                {...form.getInputProps('tshirtSize')}
              />
              <MultiSelect
                label='Dietary Restrictions'
                placeholder='Select any restrictions'
                data={[
                  { value: 'vegetarian', label: 'Vegetarian' },
                  { value: 'vegan', label: 'Vegan' },
                  { value: 'halal', label: 'Halal' },
                  { value: 'kosher', label: 'Kosher' },
                  { value: 'gluten-free', label: 'Gluten-free' },
                  { value: 'other', label: 'Other' },
                ]}
                {...form.getInputProps('dietaryRestrictions')}
              />
              <Textarea
                label='Special Accommodations'
                placeholder='Let us know if you need any accommodations'
                {...form.getInputProps('accommodations')}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label='Project & Goals' description='Your interests'>
            <Stack gap='md'>
              <MultiSelect
                required
                label='Areas of Interest'
                placeholder='Select your interests'
                data={[
                  { value: 'ai', label: 'Artificial Intelligence' },
                  { value: 'web3', label: 'Web3/Blockchain' },
                  { value: 'health', label: 'Healthcare' },
                  { value: 'education', label: 'Education' },
                  { value: 'sustainability', label: 'Sustainability' },
                  { value: 'fintech', label: 'Fintech' },
                  { value: 'social', label: 'Social Impact' },
                ]}
                {...form.getInputProps('interests')}
              />
              <Textarea
                required
                label='Project Idea'
                placeholder="Brief description of what you'd like to build"
                minRows={3}
                {...form.getInputProps('projectIdea')}
              />
              <Textarea
                required
                label='Learning Goals'
                placeholder='What do you hope to learn from this hackathon?'
                minRows={3}
                {...form.getInputProps('learningGoals')}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step label='Agreements' description='Final step'>
            <Stack gap='md'>
              <Checkbox
                required
                label={
                  <Text size='sm'>
                    I agree to the{' '}
                    <Text
                      variant='link'
                      component='a'
                      href='https://mlh.io/code-of-conduct'
                      target='_blank'
                    >
                      MLH Code of Conduct
                    </Text>
                  </Text>
                }
                {...form.getInputProps('mlhCodeOfConduct', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                required
                label={
                  <Text size='sm'>
                    I agree to the{' '}
                    <Text
                      variant='link'
                      component='a'
                      href='https://mlh.io/privacy'
                      target='_blank'
                    >
                      MLH Privacy Policy
                    </Text>
                  </Text>
                }
                {...form.getInputProps('mlhPrivacyPolicy', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                label='I authorize MLH to send me occasional emails about events and opportunities'
                {...form.getInputProps('mlhEmailConsent', { type: 'checkbox' })}
              />
            </Stack>
          </Stepper.Step>
        </Stepper>

        <Group mt='xl'>
          <Button variant='default' onClick={prevStep} disabled={active === 0}>
            Back
          </Button>
          {active === 5 ? (
            <Button
              onClick={() => form.onSubmit((values) => console.log(values))}
              disabled={
                !form.values.mlhCodeOfConduct || !form.values.mlhPrivacyPolicy
              }
            >
              Submit Application
            </Button>
          ) : (
            <Button onClick={nextStep}>Next step</Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
}
