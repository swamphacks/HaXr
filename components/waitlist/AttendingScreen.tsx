import {
  ActionIcon,
  Card,
  Center,
  Container,
  CopyButton,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';

import {
  IconCheck,
  IconCircleCheckFilled,
  IconCopy,
} from '@tabler/icons-react';
import { Competition, Status } from '@prisma/client';
import { MAX_SEAT_CAPACITY } from '@/constants/attendance';

interface Props {
  competition: Competition;
  statusCounts: Record<Status, number>;
}

export default function AttendingScreen({ competition, statusCounts }: Props) {
  return (
    <Container h='100vh'>
      <Center h='100%'>
        <Stack align='center' gap='xl'>
          <Stack align='center' gap='md'>
            <IconCircleCheckFilled size={60} color='green' />
            <Title ta='center'>Seat Secured!</Title>
            <Text ta='center'>
              All systems are go! You&apos;re confirmed to attend{' '}
              {competition.name}.
            </Text>
          </Stack>

          <Card shadow='md' radius='md'>
            <Center p='md'>
              <Stack align='center' gap='md'>
                <Text fw={600} size='1.5vw'>
                  {MAX_SEAT_CAPACITY - (statusCounts.ATTENDING ?? 0)}
                </Text>
                <Text>seats remaining.</Text>

                <TextInput
                  w='100%'
                  label='Invite your teammates'
                  onChange={() => {}}
                  value={`http://localhost:3000/hacker/waitlist/${competition.code}`}
                  rightSection={
                    <CopyButton
                      value={`http://localhost:3000/hacker/waitlist/${competition.code}`}
                      timeout={2000}
                    >
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? 'Copied' : 'Copy'}
                          withArrow
                          position='right'
                        >
                          <ActionIcon
                            color={copied ? 'teal' : 'gray'}
                            variant='subtle'
                            onClick={copy}
                          >
                            {copied ? (
                              <IconCheck style={{ width: rem(16) }} />
                            ) : (
                              <IconCopy style={{ width: rem(16) }} />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                  }
                />
              </Stack>
            </Center>
          </Card>
        </Stack>
      </Center>
    </Container>
  );
}
