import { type User, type Application, type Status } from '@prisma/client';
import {
  Modal,
  Text,
  Avatar,
  Button,
  LoadingOverlay,
  Group,
  Stack,
} from '@mantine/core';

interface applicationData {
  app: Application & { user: User };
  status: number;
}

export default function CheckInModal(
  opened: boolean,
  application: applicationData,
  onClose: () => void
) {
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

  return (
    <Modal opened={opened} onClose={onClose}>
      <Stack justify='center' align='center' gap={20}>
        <LoadingOverlay
          visible={false}
          zIndex={200}
          overlayProps={{ blur: 2, radius: 'sm' }}
        />
        <Stack justify='center' align='center' gap={6}>
          <Avatar
            size='35%'
            src={application.app.user.image}
            alt='User Profile'
          />
          <h1 className='text-3xl font-bold'>{application.app.user.name}</h1>
          <Text>University of Florida</Text>
        </Stack>
        <Text
          size='xl'
          style={{ color: getColor(application.app.status) }}
          td='underline'
        >
          {application.app.status}
        </Text>
        <Group>
          <Button color='green' size='md'>
            Check In
          </Button>
          <Button variant='outline' size='md' color='gray'>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
