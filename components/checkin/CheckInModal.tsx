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
  const [checkInData, setCheckInData] = useState<checkInResponse | null>(null);

  useEffect(() => {
    if (!opened) setCheckInData(null);
  }, [opened]);

  const checkIn = async () => {
    toggle();

    const response = await (
      await fetch(
        `/api/comp/${application.app.competition_code}/checkin/${application.app.userId}`,
        {
          method: 'POST',
        }
      )
    ).json();

    console.log(response);
    setCheckInData(response);
  };

  if (checkInData === null) {
    return (
      <Modal opened={opened} onClose={onClose} size='lg'>
        <Stack justify='center' align='center' gap={20}>
          <LoadingOverlay
            visible={visible}
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
            <Button color='green' size='md' onClick={checkIn}>
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
      {isSuccessfulResponse(checkInData) ? (
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
      ) : (
        <Stack justify='center' align='center' gap={16}>
          <Title order={1} style={{ color: 'red' }}>
            Error Checking In
          </Title>
          <Title order={3}>{checkInData.message}</Title>
          <Button color='red' size='lg' onClick={onClose}>
            Exit
          </Button>
        </Stack>
      )}
    </Modal>
  );
}
