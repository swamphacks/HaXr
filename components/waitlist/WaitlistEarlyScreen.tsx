import { Center, Code, Container, Stack, Text, Title } from '@mantine/core';
import { Competition } from '@prisma/client';
import { IconClock } from '@tabler/icons-react';

interface Props {
  competition: Competition;
}

export default function WaitlistEarlyScreen({ competition }: Props) {
  const waitlistOpenTime = competition.confirm_by.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Container h='100vh'>
      <Center h='100%'>
        <Stack align='center' gap='xl'>
          <Stack align='center' gap='md'>
            <IconClock size={60} color='orange' />
            <Title ta='center'>Waitlist Not Open Yet... </Title>
            <Text maw='70%' ta='center'>
              Slow yer roll! The waitlist for {competition.name} has not opened
              yet. Check back after <Code>{waitlistOpenTime}</Code>
            </Text>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}
