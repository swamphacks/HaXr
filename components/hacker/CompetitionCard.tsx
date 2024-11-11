import { Box, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight, IconCalendar, IconMapPin } from '@tabler/icons-react';

interface Props {
  id: string;
  name: string;
  description: string | null;
  location: string;
  start_date: Date;
  end_date: Date;
}

export default function CompetitionCard({
  id,
  name,
  description,
  location,
  start_date,
  end_date,
}: Props) {
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

  return (
    <Card w='60%'>
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
        <Button
          color='green'
          disabled={!active}
          rightSection={<IconArrowRight />}
        >
          Apply
        </Button>
      </Group>
    </Card>
  );
}
