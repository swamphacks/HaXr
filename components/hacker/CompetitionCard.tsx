import { getApplication } from '@/actions/applications';
import { Box, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Competition } from '@prisma/client';
import {
  IconArrowRight,
  IconCalendar,
  IconChecklist,
  IconMapPin,
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CompetitionCard({
  competition,
  mobile,
}: {
  competition: Competition;
  mobile: boolean;
}) {
  const [applied, setApplied] = useState(false);
  const { code, name, start_date, end_date, location, description } =
    competition;

  const { data: session, status } = useSession();

  const router = useRouter();

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const year = startDate.getFullYear();

    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  };

  const date = formatDateRange(start_date, end_date);

  const active = Date.now() < end_date.getTime();

  useEffect(() => {
    const fetchApplications = async () => {
      const app = await getApplication(code, session?.user?.id!);

      setApplied(!!app);
    };

    fetchApplications();
  });

  return (
    <Card w={mobile ? '100%' : '60%'}>
      <Group justify='space-between' px={10} py={10}>
        <Stack gap={1}>
          <Title order={3}>{name}</Title>
          <Text>{description}</Text>
          <Group mt={5} ml={-1}>
            <Group gap={5}>
              <IconMapPin size={20} color='gray' />
              <Text c='dimmed' size='md' mt={3}>
                {location}
              </Text>
            </Group>

            <Group gap={5}>
              <IconCalendar size={20} color='gray' />
              <Text c='dimmed' size='md' mt={3}>
                {date}
              </Text>
            </Group>
          </Group>
        </Stack>
        {applied ? (
          <Button
            color='yellow'
            variant='light'
            rightSection={<IconChecklist />}
            onClick={() => router.push(`/hacker/application/${code}`)}
          >
            Under Review
          </Button>
        ) : (
          <Button
            color='green'
            rightSection={<IconArrowRight />}
            onClick={() => router.push(`/hacker/application/${code}`)}
          >
            Apply
          </Button>
        )}
      </Group>
    </Card>
  );
}
