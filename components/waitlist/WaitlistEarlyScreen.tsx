'use client';
import { CountdownState } from '@/hooks/useCountdownTimer';
import {
  Card,
  Center,
  Container,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { Competition } from '@prisma/client';
import { IconHelpHexagon } from '@tabler/icons-react';

interface Props {
  competition: Competition;
  countdown: CountdownState | null;
}

interface NumberCardProps {
  num: number;
  label: string;
}

const NumberCard = ({ num, label }: NumberCardProps) => (
  <Stack ta='center' align='center' gap='xs'>
    <Text visibleFrom='sm' size='7vw' fw={600}>
      {num}
    </Text>
    <Text hiddenFrom='sm' size='8vh' fw={600}>
      {num}
    </Text>
    <Text visibleFrom='sm' size='1.5vw'>
      {label}
    </Text>
    <Text hiddenFrom='sm' size='2vh'>
      {label}
    </Text>
  </Stack>
);

export default function WaitlistEarlyScreen({ competition, countdown }: Props) {
  if (!countdown) return null;

  return (
    <Container h='100vh'>
      <Center h='100%'>
        <Stack align='center'>
          <Card shadow='xl' radius='lg' maw={{ base: '90%', sm: '100%' }}>
            <Center h='100%'>
              <Stack align='center' w='100%' gap='xl' px='xl' py='lg'>
                <Group
                  visibleFrom='md'
                  gap='5vw'
                  align='flex-start'
                  wrap='nowrap'
                >
                  <NumberCard num={countdown.days} label='Days' />
                  <NumberCard num={countdown.hours} label='Hours' />
                  <NumberCard num={countdown.minutes} label='Minutes' />
                  <NumberCard num={countdown.seconds} label='Seconds' />
                </Group>

                <Group
                  hiddenFrom='md'
                  gap='2vh'
                  align='flex-start'
                  wrap='nowrap'
                >
                  <NumberCard num={countdown.days} label='Days' />
                  <NumberCard num={countdown.hours} label='Hours' />
                  <NumberCard num={countdown.minutes} label='Minutes' />
                  <NumberCard num={countdown.seconds} label='Seconds' />
                </Group>
              </Stack>
            </Center>
          </Card>

          {/* Description */}
          <Stack ta='center' gap='sm' align='center' mt='xl'>
            <Group visibleFrom='md'>
              <Title order={3} fw={500}>
                {competition.name}&apos;s Waitlist opens in...
              </Title>

              {/* Tooltip only in desktop because mobile goes off screen */}
              <Tooltip label='When the timer hits 0, you will be sent to a screen to join SwampHacks based on available seats.'>
                <IconHelpHexagon
                  className='hover:cursor-pointer'
                  size={24}
                  color='gray'
                />
              </Tooltip>
            </Group>

            <Group hiddenFrom='md'>
              <Title order={4} fw={500}>
                {competition.name}&apos;s Waitlist opens in...
              </Title>
            </Group>
            <Text c='gray.6'>You do not need to refresh.</Text>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}
