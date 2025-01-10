import { Alert, Center, Container, Stack, Text, Title } from '@mantine/core';
import { Application, Competition } from '@prisma/client';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconQuestionMark,
} from '@tabler/icons-react';

interface Props {
  competition: Competition;
  userApplication: Application | null;
}

export default function IneligibleScreen({
  competition,
  userApplication,
}: Props) {
  const getIneligibleReason = (): string => {
    if (!userApplication) return 'You have not applied to this competition.';
    if (userApplication.status === 'REJECTED')
      return 'You have been rejected from this competition.';
    if (userApplication.status === 'STARTED')
      return 'You have started your application but have not completed it.';
    if (userApplication.status === 'NOT_ATTENDING')
      return 'You have declined your invitation to this competition.';
    if (userApplication.status === 'APPLIED')
      return 'You have applied to this competition but no decision has been made by us yet.';
    return 'Something went wrong with your application. Please contact us on Discord or at support@swamphacks.com';
  };

  return (
    <Container h='100vh'>
      <Center h='100%'>
        <Stack align='center' gap='xl'>
          <Stack align='center' gap='md'>
            <IconCircleXFilled size={60} color='red' />
            <Title ta='center'>Ineligible</Title>
            <Text ta='center'>
              Unfortunately, you are not eligible to attend {competition.name}.
            </Text>
          </Stack>

          <Alert
            w={{ base: '90%', md: '100%' }}
            maw='100%'
            color='blue'
            icon={<IconQuestionMark />}
            title='Why am I ineligible?'
          >
            {getIneligibleReason()}
          </Alert>
        </Stack>
      </Center>
    </Container>
  );
}
