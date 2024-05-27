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

interface errorData {
  message: string;
  status: number;
}

interface ErrorModalProps {
  opened: boolean;
  error: errorData | null;
  onClose: () => void;
}

export default function ErrorModal({
  opened,
  error,
  onClose,
}: ErrorModalProps) {
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
        <Text size='lg' style={{ color: 'red' }}>
          Error
        </Text>
        <Text>{error?.status}</Text>
        <Text>{error?.message}</Text>
        <Group>
          <Button color='red' size='lg' onClick={onClose}>
            Exit
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
