import { Center, Code, Container, Stack, Text, Title } from '@mantine/core';
import { Competition } from '@prisma/client';
import { IconSkull } from '@tabler/icons-react';

interface Props {
  competition: Competition;
}

export default function WaitlistLateScreen({ competition }: Props) {
  function getFormattedTimeDifference(startDate: Date) {
    let d1 = new Date(startDate);
    let d2 = new Date();

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();
    let hours = d2.getHours() - d1.getHours();
    let minutes = d2.getMinutes() - d1.getMinutes();

    // Adjust for negative values
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      const previousMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += previousMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    // Format the result
    const parts = [];
    if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

    return parts.length > 0 ? parts.join(', ') : '0 minutes';
  }

  return (
    <Container h='100vh'>
      <Center h='100%'>
        <Stack align='center' gap='xl'>
          <Stack align='center' gap='md'>
            <IconSkull size={60} />
            <Title ta='center'>Waitlist Closed</Title>

            <Stack align='center' gap={0}>
              <Text maw='100%' ta='center'>
                We&apos;re rolling in our graves! The waitlist for{' '}
                {competition.name} closed
              </Text>
              <Code>{getFormattedTimeDifference(competition.confirm_by)}</Code>
              <Text maw='100%' ta='center'>
                ago.
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}
