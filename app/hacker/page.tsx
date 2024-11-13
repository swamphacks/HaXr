'use client';
import { getCompetition, getCompetitions } from '@/actions/competition';
import CompetitionCard from '@/components/hacker/CompetitionCard';
import UserAvatar from '@/components/UserAvatar';
import {
  Alert,
  Anchor,
  Box,
  Container,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Competition } from '@prisma/client';
import { IconSpeakerphone } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hacker() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const mobile = useMediaQuery('(max-width: 1200px)');

  useEffect(() => {
    const fetchCurrentCompetition = async () => {
      const comp = await getCompetitions().then((cs) => cs[0]);
      setCompetition(comp);
      setLoading(false);
    };

    fetchCurrentCompetition();
  }, []);

  return (
    <Container>
      <Stack align='center' gap={0} w='100%'>
        <Stack my='xl' align='center' gap={0}>
          <Title>SwampHacks Hacker Portal</Title>
          <Text c='dimmed' size='lg'>
            Select a competition to get started.
          </Text>
        </Stack>

        {!mobile && (
          <Box pos='absolute' top={20} right={20}>
            <UserAvatar session={session!} />
          </Box>
        )}

        <Stack align='center' w='100%'>
          <Alert
            title='Announcement'
            icon={<IconSpeakerphone size={20} />}
            color='yellow'
            w={mobile ? '100%' : '60%'}
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
          {competition && (
            <CompetitionCard mobile={mobile!} competition={competition} />
          )}
          {mobile && <UserAvatar session={session!} />}
        </Stack>

        {!competition && (
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
    </Container>
  );
}
