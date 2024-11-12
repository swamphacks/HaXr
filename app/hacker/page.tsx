'use client';
import { getCompetition, getCompetitions } from '@/actions/competition';
import CompetitionCard from '@/components/hacker/CompetitionCard';
import UserAvatar from '@/components/UserAvatar';
import { Alert, Box, Container, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Competition } from '@prisma/client';
import { IconSpeakerphone } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
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
          <Title order={mobile ? 2 : 1}>SwampHacks Hacker Portal 🐊</Title>
          <Text c='dimmed' size='lg'>
            Select a hackathon to enter its portal or apply.
          </Text>
        </Stack>

        {!mobile && (
          <Box pos='absolute' top={20} right={20}>
            <UserAvatar session={session!} />
          </Box>
        )}

        <Stack align='center' w='100%'>
          <Alert
            title='Portal Announcement'
            icon={<IconSpeakerphone size={20} />}
            color='yellow'
            w={mobile ? '100%' : '60%'}
          >
            This portal is currently still being developed so make sure to check
            back regularly for all the cool new features coming. - Swamphacks
            Tech
          </Alert>
          {competition && (
            <CompetitionCard mobile={mobile!} competition={competition} />
          )}
          {mobile && <UserAvatar session={session!} />}
        </Stack>

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
      </Stack>
    </Container>
  );
}
