import { type User, type Application, type Status } from '@prisma/client';
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
import { useState } from 'react';
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
  const [success, setSuccess] = useState(false);
  const [checkInResponse, setCheckInResponse] = useState();

  const checkIn = async () => {
    toggle();

    const response = await fetch(
      `/api/comp/${application.app.competition_code}/checkin/${application.app.userId}`,
      {
        method: 'POST',
      }
    );

    const data = await response.json();

    console.log(data);

    toggle();
    setSuccess(true);
  };

  return (
    <Modal opened={opened} onClose={onClose} size='lg'>
      {success ? (
        <Text>Check In Successfully</Text>
      ) : (
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
      )}
    </Modal>
  );
}
