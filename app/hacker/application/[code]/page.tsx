'use client';
import { getCompetition } from '@/actions/competition';
import Spinner from '@/components/Spinner';
import {
  Paper,
  Container,
  Title,
  Stack,
  Fieldset,
  Group,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Competition } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function HackerApplication({
  params: { code },
}: {
  params: { code: string };
}) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    initialValues: {
      phoneNumber: '',
    },
    // Optional validation
    validate: {
      phoneNumber: (value) =>
        /^\(\d{3}\)-\d{3}-\d{4}$/.test(value)
          ? null
          : 'Invalid phone number format',
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
    <Container size='md' py='xl'>
      <Paper radius='md' p='xl' withBorder>
        <Stack align='center'>
          <Title mb={20}>{competition?.name} Application 🐊 🔟</Title>
          <Stack gap={10} w='70%'>
            <Fieldset legend='Personal Information'>
              <Stack gap={10}>
                <Group w='100%' justify='center' align='center'>
                  {/* First and last name */}
                  <TextInput flex={1} label='First Name' required />
                  <TextInput flex={1} label='Last Name' required />
                </Group>

                {/* Email and phone number */}
                <TextInput
                  label='Email'
                  placeholder='johndoe@roblox.com'
                  required
                />
                <TextInput
                  label='Phone Number'
                  placeholder='(314)-952-6281'
                  required
                  value={form.values.phoneNumber}
                />
              </Stack>
            </Fieldset>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
