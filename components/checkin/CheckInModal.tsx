import { Application, User } from '@prisma/client';
import {
  Avatar,
  Button,
  List,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { checkIn, getApplication, getCheckInChecks } from '@/actions/scanning';
import { ReactNode, useEffect, useState } from 'react';
import {
  IconCircleCheck,
  IconCircleDashed,
  IconInfoCircle,
  IconListCheck,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Check, CheckType, SingleCheck } from '@/types/scanning';

const getCheckIcon = (check: Check): ReactNode => {
  if (check.type === CheckType.Automated) {
    return (
      <ThemeIcon color={check.complete ? 'green' : 'red'} size={24} radius='xl'>
        <IconCircleCheck size={16} />
      </ThemeIcon>
    );
  } else if (check.type === CheckType.Manual) {
    return (
      <ThemeIcon color='gray' size={24} radius='xl'>
        <IconCircleDashed size={16} />
      </ThemeIcon>
    );
  } else if (check.type === CheckType.Info) {
    return (
      <ThemeIcon color='blue' size={24} radius='xl'>
        <IconInfoCircle size={16} />
      </ThemeIcon>
    );
  } else if (check.type === CheckType.Dependent) {
    return (
      <ThemeIcon
        color={
          check.dependsOn
            .filter((c) => c.type === CheckType.Automated && c.required)
            .every((c) => 'complete' in c && c.complete!)
            ? 'green'
            : 'red'
        }
        size={24}
        radius='xl'
      >
        <IconListCheck size={16} />
      </ThemeIcon>
    );
  }
};

const renderSingleCheck = (c: SingleCheck) => {
  if ('required' in c) {
    if (!c.required) {
      return (
        <List.Item icon={getCheckIcon(c)}>
          <b>(Optional)</b> {c.name}
        </List.Item>
      );
    }
  }
  return <List.Item icon={getCheckIcon(c)}>{c.name}</List.Item>;
};

interface Props {
  comp: string | null;
  user: User | null;
  deselectUser: () => void;
}

export default function CheckInModal({ comp, user, deselectUser }: Props) {
  const [application, setApplication] = useState<Application | null>(null);
  const [checks, setChecks] = useState<Check[] | null>(null);

  useEffect(() => {
    if (comp && user) {
      getApplication(comp, user.id).then((app) => setApplication(app));
      getCheckInChecks(comp, user.id).then((tasks) => setChecks(tasks));
    }
  }, [comp, user]);

  return (
    <Modal
      opened={user !== null}
      withCloseButton={false}
      onClose={deselectUser}
      size='auto'
      centered={true}
      padding='lg'
    >
      {user && application && checks && (
        <>
          <Stack justify='center' align='center' gap={20}>
            <Stack align='center' gap={20}>
              <Avatar size='xl' src={user.image} alt='Profile Picture' />
              <Stack align='center' gap={0}>
                <Title order={2}>
                  {user.firstName} {user.lastName}
                </Title>
                <Title order={4}>University</Title>
                <Text>({user.email})</Text>
              </Stack>
            </Stack>
          </Stack>

          <List spacing='xs' size='sm' center m='xs'>
            {checks.map((c) => {
              if (c.type === CheckType.Dependent) {
                return (
                  <>
                    <List.Item icon={getCheckIcon(c)}>{c.name}</List.Item>
                    <List.Item>
                      <List withPadding size='sm'>
                        {c.dependsOn.map(renderSingleCheck)}
                      </List>
                    </List.Item>
                  </>
                );
              }
              return renderSingleCheck(c);
            })}
          </List>

          <Stack gap='xs' mt='sm'>
            <Button
              color='green'
              size='md'
              fullWidth
              onClick={async () => {
                const r = await checkIn(application.competitionCode, user.id);
                if ('error' in r) {
                  if (r.checks) setChecks(r.checks);
                  notifications.show({
                    title: 'Failure',
                    message: r.error,
                    color: 'red',
                  });
                } else {
                  deselectUser();
                  notifications.show({
                    title: 'Success',
                    message: r.idempotent
                      ? 'Hacker has already been checked in'
                      : 'Hacker was successfully checked in',
                    color: 'green',
                  });
                }
              }}
            >
              Check In
            </Button>

            <Button
              size='md'
              fullWidth
              color='red'
              variant='outline'
              onClick={deselectUser}
            >
              Exit
            </Button>
          </Stack>
        </>
      )}
    </Modal>
  );
}
