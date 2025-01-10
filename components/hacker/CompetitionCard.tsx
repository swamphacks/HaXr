import {
  CompetitionWithApplication,
  confirmAttendance,
} from '@/actions/applications';
import {
  Button,
  Card,
  CopyButton,
  Group,
  Menu,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Status } from '@prisma/client';
import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconClipboardCheck,
  IconConfetti,
  IconForms,
  IconHourglass,
  IconMapPin,
  IconMoodSad,
  IconQrcode,
  IconX,
  IconZoomMoney,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

interface Props {
  competition: CompetitionWithApplication;
}

const formatDateTime = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function CompetitionCard({
  competition: {
    code,
    name,
    description,
    location,
    apply_close,
    decision_release,
    confirm_by,
    start_date,
    end_date,
    application,
  },
}: Props) {
  const router = useRouter();

  const startDateStr = formatDateTime(start_date),
    endDateStr = formatDateTime(end_date),
    sameDay = startDateStr === endDateStr;
  const now = new Date();

  const isWaitlistOpen = now > confirm_by && now < start_date;

  const StatusButton: Record<Status | 'NOT_STARTED', React.ReactElement> = {
    NOT_STARTED: (
      <Button
        color='green'
        rightSection={<IconChevronRight />}
        onClick={() => router.push(`/hacker/application/${code}`)}
      >
        Apply
      </Button>
    ),

    [Status.STARTED]: (
      <Button
        color='blue'
        rightSection={<IconChevronRight />}
        onClick={() => router.push(`/hacker/application/${code}`)}
      >
        Continue
      </Button>
    ),
    [Status.APPLIED]: (
      <Button
        color='yellow'
        variant='light'
        rightSection={<IconZoomMoney />}
        onClick={() =>
          notifications.show({
            title: 'Application Submitted',
            color: 'yellow',
            message:
              'Your application has been submitted successfully and is under review. You will be notified of the decision by the release date.',
          })
        }
      >
        Under Review
      </Button>
    ),

    [Status.REJECTED]: (
      <Button
        color='red'
        variant='light'
        onClick={() =>
          notifications.show({
            title: 'Rejected',
            color: 'red',
            message:
              'We regret to inform you that your application has been rejected. Thank you for applying and we hope to see you at future events!',
          })
        }
      >
        Rejected
      </Button>
    ),
    [Status.WAITLISTED]: isWaitlistOpen ? (
      <Button
        color='green'
        variant='light'
        rightSection={<IconChevronRight />}
        onClick={() => router.push(`/hacker/waitlist/${code}`)}
      >
        Waitlist Open
      </Button>
    ) : (
      <Button
        color='orange'
        variant='light'
        rightSection={<IconChevronRight />}
        onClick={() =>
          notifications.show({
            title: 'Waitlisted',
            icon: <IconHourglass />,
            color: 'orange',
            message:
              'You have been placed on the waitlist. You will be notified if a spot becomes available.',
          })
        }
      >
        Waitlisted
      </Button>
    ),
    [Status.ACCEPTED]: (
      <>
        <Button color='green' variant='light'>
          Accepted 🎉
        </Button>

        <Menu trigger='click-hover' withArrow>
          <Menu.Target>
            <Button color='green' rightSection={<IconChevronDown />}>
              Confirm Attendance
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              color='green'
              leftSection={<IconCheck />}
              onClick={async () => {
                if (!application) return;
                await confirmAttendance(application.id, true);

                notifications.show({
                  title: 'Attendance Confirmed',
                  icon: <IconConfetti />,
                  color: 'green',
                  message:
                    'Thank you for confirming your attendance. We look forward to seeing you at the event! Be sure to check your email for more information.',
                });

                router.refresh();
              }}
            >
              Attending
            </Menu.Item>

            <Menu.Item
              color='red'
              leftSection={<IconX />}
              onClick={async () => {
                if (!application) return;
                await confirmAttendance(application.id, false);

                notifications.show({
                  title: 'Attendance Declined',
                  color: 'red',
                  message:
                    'We are sorry to hear that you cannot attend. Thank you for applying and we hope to see you at future events!',
                });

                router.refresh();
              }}
            >
              Not Attending
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </>
    ),

    [Status.NOT_ATTENDING]: (
      <Button color='red' variant='light' rightSection={<IconMoodSad />}>
        Not Attending
      </Button>
    ),
    [Status.ATTENDING]: (
      <>
        <Button color='green' variant='light' rightSection={<IconConfetti />}>
          Attending
        </Button>

        <Group>
          <CopyButton value={application?.id || ''}>
            {({ copied, copy }) => (
              <Button
                variant='light'
                leftSection={copied ? <IconClipboardCheck /> : <IconForms />}
                color={copied ? 'green' : 'gray'}
                onClick={copy}
              >
                Application ID
              </Button>
            )}
          </CopyButton>

          <Button
            leftSection={<IconQrcode />}
            variant='light'
            color='gray'
            onClick={() =>
              notifications.show({
                title: 'Check-in',
                color: 'gray',
                message:
                  now < start_date
                    ? `Check-in will be available on ${formatDateTime(
                        start_date
                      )}.`
                    : 'Not implemented yet.',
              })
            }
          >
            Check-in
          </Button>
        </Group>
      </>
    ),
  };

  let status: Status | 'NOT_STARTED' = application?.status || 'NOT_STARTED';

  // People that did not apply get will not be attending
  // Also, hide any advanced statuses until release date
  // Lastly, if it's past the confirm by date, set to not attending
  if (now > apply_close && ['NOT_STARTED', Status.STARTED].includes(status))
    status = Status.NOT_ATTENDING;
  else if (
    now < decision_release &&
    !['NOT_STARTED', Status.STARTED, Status.APPLIED].includes(status)
  )
    status = Status.APPLIED;
  else if (now > confirm_by && status === Status.ACCEPTED)
    status = Status.NOT_ATTENDING;

  return (
    <Card w='100%'>
      <Group justify='space-between' px={10} py={10}>
        <Stack gap='xs'>
          <Title order={2}>{name}</Title>
          <Text>{description}</Text>

          <Group gap='xl'>
            <Group gap='xs'>
              <IconMapPin size={20} color='gray' />
              <Text c='dimmed' size='md' mt={3}>
                {location}
              </Text>
            </Group>

            <Group gap='xs'>
              <IconCalendar size={20} color='gray' />
              <Text c='dimmed' size='md' mt={3}>
                {sameDay ? startDateStr : `${startDateStr} - ${endDateStr}`}
              </Text>
            </Group>
          </Group>
        </Stack>

        {StatusButton[status]}
      </Group>
    </Card>
  );
}
