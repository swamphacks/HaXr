'use client';
import {
  Alert,
  Anchor,
  Box,
  Container,
  Divider,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconSpeakerphone } from '@tabler/icons-react';
import { Session } from 'next-auth';
import CompetitionCard from './CompetitionCard';
import { CompetitionWithApplication } from '@/actions/applications';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';

interface Props {
  session: Session;
  compsWithApps: CompetitionWithApplication[];
}

export default function HackerDashboard({
  session,
  compsWithApps: competitions,
}: Props) {
  return (
    <>
      <Box pos='absolute' top={0} right={0} p='sm'>
        <UserAvatar session={session} />
      </Box>

      <Container size='sm' px='lg' mt='lg'>
        <Stack align='center' gap={0} w='100%'>
          {/* Header */}
          <Stack my='xl' align='center' gap={0}>
            <>
              <Title className='text-center' visibleFrom='sm'>
                SwampHacks Hacker Portal
              </Title>
              <Title order={2} className='text-center' hiddenFrom='sm'>
                SwampHacks Hacker Portal
              </Title>
            </>

            <Text c='dimmed' size='lg'>
              Select a competition to get started.
            </Text>
          </Stack>

          {/* Announcements + Competitions */}
          <Stack align='center' w='100%' gap='md'>
            <Alert
              title='Announcement'
              icon={<IconSpeakerphone size={20} />}
              color='yellow'
            >
              This portal is currently still under development. Feel free to{' '}
              <Anchor href='mailto:tech@swamphacks.com' inherit>
                contact us
              </Anchor>{' '}
              if you have any issues. We will be releasing updates as the event
              approaches, so stay tuned!
              <span className='mt-2 block text-right'>
                <b>SwampHacks Tech Team 🐊</b>
              </span>
            </Alert>

            <Divider w='100%' label={<Text>Competitions</Text>} />

            {/* Competitions */}
            <Stack align='center' w='100%' gap='sm'>
              {competitions.map((comp) => (
                <CompetitionCard key={comp.code} competition={comp} />
              ))}

              {!competitions && (
                <Stack align='center' gap={20} mt={50} w='50%'>
                  <Text fw={700} size='xl'>
                    Wow, much empty.
                  </Text>
                  <Image
                    alt='Sad cat'
                    unoptimized
                    loader={() =>
                      'https://media.tenor.com/D_yuP4xjddsAAAAM/crying-vaughn-chat.gif'
                    }
                    src='https://media.tenor.com/D_yuP4xjddsAAAAM/crying-vaughn-chat.gif'
                    width={200}
                    height={200}
                  />
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
