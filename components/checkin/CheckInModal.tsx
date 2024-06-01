import {
  type User,
  type Application,
  type Status,
  Attendees,
} from '@prisma/client';
import {
  Modal,
  Text,
  Avatar,
  Button,
  LoadingOverlay,
  Group,
  Stack,
  Stepper,
  Title,
  Box,
  Divider,
  Card,
  Fieldset,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconSearch, IconUserCancel, IconUserCheck } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import useCheckIn from '@/hooks/useCheckIn';
import { notifications } from '@mantine/notifications';

interface applicationData {
  app: Application & { user: User };
  status: number;
}

interface CheckInModalProps {
  opened: boolean;
  application: applicationData;
  onClose: () => void;
}

interface checkinSuccess {
  attendee: Attendees;
  status: number;
}

interface checkinError {
  message: string;
  status: number;
}

type checkInResponse = checkinSuccess | checkinError;

const isSuccessfulResponse = (
  response: checkInResponse | null
): response is checkinSuccess => {
  if (response === null) return false;
  return response.status === 200;
};

export default function CheckInModal({
  opened,
  application,
  onClose,
}: CheckInModalProps) {
  const getColor = (status: Status) => {
    switch (status) {
      case 'ACCEPTED':
        return '#00ff00';
      case 'REJECTED':
        return '#ff0000';
      case 'STARTED':
        return '#ffdb58';
      default:
        return 'white';
    }
  };

  const [visible, { toggle }] = useDisclosure(false);

  const {
    checkInHacker,
    loading,
    checkInData,
    checkInStatus,
    setCheckInData,
    okCheckInResponse,
  } = useCheckIn(application.app.competition_code);

  // This is for notifications
  useEffect(() => {
    if (checkInStatus === 'error' && !okCheckInResponse(checkInData)) {
      notifications.show({
        title: `Error ${checkInData?.status}`,
        message: checkInData?.message,
        color: 'red',
        autoClose: 4000,
      });
    }
  }, [checkInStatus, checkInData, okCheckInResponse]);

  useEffect(() => {
    if (!opened) setCheckInData(null);
  }, [opened, setCheckInData]);

  if (checkInData === null || !isSuccessfulResponse(checkInData)) {
    return (
      <Modal opened={opened} onClose={onClose} size='lg'>
        <Stack justify='center' align='center' gap={20}>
          <LoadingOverlay
            visible={loading}
            zIndex={200}
            overlayProps={{ blur: 2, radius: 'sm' }}
          />

          <Stack justify='center' align='center' gap={20}>
            <Avatar
              size='30%'
              src={application.app.user.image}
              alt='User Profile'
            />
            <Title order={1}>{application.app.user.name}</Title>
          </Stack>
          <Fieldset legend='Applicant Information' w='80%'>
            {/* TODO: Make school field in database and call it here. */}
            <Text>School: University of Florida</Text>
            <Text>Email: {application.app.user.email}</Text>
            <Text>
              Status:{' '}
              <span style={{ color: getColor(application.app.status) }}>
                {application.app.status}
              </span>
            </Text>
          </Fieldset>
          <Group>
            <Button
              color='green'
              size='md'
              onClick={() => checkInHacker(application.app.userId)}
            >
              Check In
            </Button>
            <Button onClick={onClose} variant='outline' size='md' color='gray'>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} size='lg'>
      <Stack justify='center' align='center' gap={8}>
        <Title order={1} style={{ color: 'lightgreen' }}>
          Checked In Successfully
        </Title>
        <Avatar
          size='30%'
          src={application.app.user.image}
          alt='User Profile'
        />
        <Title order={3}>{application.app.user.name}</Title>
        <Text>Points: {checkInData.attendee.points}</Text>

        <Button color='green' size='md' mt={15} onClick={onClose}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
}
