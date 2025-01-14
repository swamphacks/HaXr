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

type DisplayStatus =
  | Status
  | 'NOT_STARTED'
  | 'MISSED_APPLICATION_DEADLINE'
  | 'MISSED_CONFIRMATION_DEADLINE';

const AdvancedStatuses: DisplayStatus[] = [
  Status.REJECTED,
  Status.WAITLISTED,
  Status.ACCEPTED,
  Status.NOT_ATTENDING,
  Status.ATTENDING,
];

export default function CompetitionCard({
  competition: {
    code,
    name,
    description,
    location,
    apply_close,
    decision_release,
    confirm_by,
    waitlist_open,
    waitlist_close,
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

  const StatusButton: Record<DisplayStatus, React.ReactElement> = {
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
    ['MISSED_APPLICATION_DEADLINE']: (
      <Button color='gray' variant='light'>
        Missed Deadline
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
        rightSection={<IconMoodSad />}
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
    [Status.WAITLISTED]: !waitlist_open ? (
      <Button color='orange' variant='light'>
        Waitlisted
      </Button>
    ) : !waitlist_close || now < waitlist_close ? (
      <Button
        color='orange'
        variant='light'
        rightSection={<IconChevronRight />}
        onClick={() => router.push(`/hacker/waitlist/${code}`)}
      >
        Join Waitlist
      </Button>
    ) : (
      <Button color='orange' variant='light'>
        Waitlist Closed
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

    ['MISSED_CONFIRMATION_DEADLINE']: (
      <Button
        color='red'
        variant='light'
        rightSection={<IconMoodSad />}
        onClick={() =>
          notifications.show({
            title: 'Confirmation Deadline Missed',
            color: 'red',
            message:
              'Unfortunately, you missed the confirmation deadline. Thank you for applying and we hope to see you at future events!',
          })
        }
      >
        Missed Confirmation Deadline
      </Button>
    ),

    [Status.ATTENDING]: (
      <Group justify='space-between' w='100%'>
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
      </Group>
    ),
  };

  let status: DisplayStatus = application?.status || 'NOT_STARTED';

  // Display missed application deadline status for applications that were not submitted in time
  if (now > apply_close && ['NOT_STARTED', Status.STARTED].includes(status))
    status = 'MISSED_APPLICATION_DEADLINE';
  // Hide advanced statuses before decision release
  else if (now < decision_release && AdvancedStatuses.includes(status))
    status = Status.APPLIED;
  // Display missed confirmation deadline for accepted applications that were not confirmed in time
  else if (now > confirm_by && status === Status.ACCEPTED)
    status = 'MISSED_CONFIRMATION_DEADLINE';

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
