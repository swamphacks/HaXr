import { getCompetition } from '@/actions/competition';
import { auth } from '@/auth';
import {
  Box,
  Card,
  Code,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';

interface Props {
  params: {
    code: string;
  };
}

export default async function Admin({ params: { code } }: Props) {
  const competition = await getCompetition(code);
  const session = await auth();

  const today = new Date();

  const daysBetweenDates = (date1: Date, date2: Date) => {
    // Convert both dates to milliseconds
    const msPerDay = 86400000; // Number of milliseconds in a day
    const date1Ms = new Date(date1).getTime();
    const date2Ms = new Date(date2).getTime();

    // Calculate the difference in milliseconds
    const differenceMs = date2Ms - date1Ms;

    // Convert milliseconds to days
    const differenceDays = Math.round(differenceMs / msPerDay);

    return differenceDays;
  };

  return (
    <Stack w='100%' h='100%'>
      <Group gap={10} justify='start' align='start'>
        <Box className='border-2 border-zinc-800 bg-zinc-800 p-5 shadow-sm shadow-zinc-600'>
          <Title>
            Welcome back {session?.user?.firstName} {session?.user?.lastName}
          </Title>
        </Box>
        <Box className='border-2 border-zinc-800 bg-zinc-800 p-5 shadow-sm shadow-zinc-600'>
          <RingProgress
            size={500}
            thickness={100}
            label={
              <Text size='md' ta='center'>
                Application status overview
              </Text>
            }
            sections={[
              { value: 40, color: 'green.7', tooltip: 'Confirmed attendees' },
              { value: 15, color: 'yellow.5', tooltip: 'Interested' },
              { value: 15, color: 'red.8', tooltip: 'Rejected' },
            ]}
          />
        </Box>
      </Group>
    </Stack>
  );
}
