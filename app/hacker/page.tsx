'use client';
import { getCompetitions } from '@/actions/competition';
import CompetitionCard from '@/components/hacker/CompetitionCard';
import UserAvatar from '@/components/UserAvatar';
import { Box, Container, Skeleton, Stack, Text, Title } from '@mantine/core';
import { Competition } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Hacker() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState<{
    current: Competition[];
    upcoming: Competition[];
    past: Competition[];
  }>({
    current: [],
    upcoming: [],
    past: [],
  });

  useEffect(() => {
    const fetchCompetition = async () => {
      const data = await getCompetitions();
      sortCompetitions(data);
    };

    try {
      fetchCompetition();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const sortCompetitions = (comps: Competition[]) => {
    const currentDate = new Date();

    const filtered_comps = {
      current: comps.filter((comp) => {
        const startDate = new Date(comp.start_date);
        const endDate = new Date(comp.end_date);
        return startDate <= currentDate && endDate >= currentDate;
      }),
      upcoming: comps.filter((comp) => {
        const startDate = new Date(comp.start_date);
        return startDate > currentDate;
      }),
      past: comps.filter((comp) => {
        const endDate = new Date(comp.end_date);
        return endDate < currentDate;
      }),
    };

    filtered_comps.current.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    filtered_comps.upcoming.sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    filtered_comps.past.sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    ); // Past events in reverse chronological

    setCompetitions(filtered_comps);
  };

  const CompetitionSection = ({
    title,
    competitions,
    empty = 'No hackathons in this category.',
  }: {
    title: string;
    competitions: Competition[];
    empty?: string;
  }) => (
    <>
      <Box w='60%' mt='xl'>
        <Title order={2}>{title}</Title>
      </Box>
      {competitions.length > 0 ? (
        competitions.map((comp) => (
          <CompetitionCard
            key={comp.code}
            id={comp.code}
            name={comp.name}
            description={comp.description}
            location={comp.location}
            start_date={comp.start_date}
            end_date={comp.end_date}
          />
        ))
      ) : (
        <Text c='dimmed' my='md'>
          {empty}
        </Text>
      )}
    </>
  );

  return (
    <Container>
      <Stack my='xl' align='center' gap={0}>
        <Title order={1}>Swamphacks Hacker Portal</Title>
        <Text c='dimmed' size='lg'>
          Select your current hackathon to see your dashboard or apply to an
          upcoming one!
        </Text>
      </Stack>

      <Box pos='absolute' top={20} right={20}>
        <UserAvatar session={session!} />
      </Box>

      <Stack align='center'>
        {loading ? (
          <>
            <Skeleton height={150} w='60%' radius={5} />
            <Skeleton height={150} w='60%' radius={5} />
            <Skeleton height={150} w='60%' radius={5} />
            <Skeleton height={150} w='60%' radius={5} />
            <Skeleton height={150} w='60%' radius={5} />
          </>
        ) : (
          <>
            <CompetitionSection
              title='Current Hackathon'
              competitions={competitions.current}
              empty='No hackathons are currently running.'
            />
            <CompetitionSection
              title='Upcoming Hackathons'
              competitions={competitions.upcoming}
              empty='No upcoming hackathons at this time.'
            />
            <CompetitionSection
              title='Past Hackathons'
              competitions={competitions.past}
              empty='No past hackathons.'
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
