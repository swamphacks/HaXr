'use client';
import QrScanner from '@/components/admin/QrScanner';
import { type Application, type User, type Status } from '@prisma/client';
import {
  Box,
  Group,
  LoadingOverlay,
  Stack,
  Modal,
  Text,
  Avatar,
  Button,
} from '@mantine/core';
import { useCallback, useContext, useState } from 'react';
import { CompetitionContext } from '@/components/admin/AdminShell';
import { useDisclosure } from '@mantine/hooks';

interface successResponse {
  app: Application & { user: User };
  status: number;
}

interface errorResponse {
  message: string;
  status: number;
}

type apiResponse = successResponse | errorResponse;

const isSuccessfulResponse = (
  response: apiResponse
): response is successResponse => {
  return response.status === 200;
};

export default function ScanCheckIn() {
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [response, setResponse] = useState<apiResponse | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [visible, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);

  const { competition } = useContext(CompetitionContext);

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

  const onScan = async (result: string) => {
    // Already doing something else
    if (!cameraActive) return;

    // If currently scanning...
    setCameraActive(false);
    toggle();

    const res = await (
      await fetch(`/api/comp/${competition?.code}/application/${result}`)
    ).json();

    setResponse(res);

    if (isSuccessfulResponse(res)) {
      setError(false);
      open();
    } else {
      setError(true);
      open();
    }
  };

  return (
    <Stack gap='md' align='center' justify='flex-start'>
      <Modal
        opened={opened}
        onClose={() => {
          setCameraActive(true);
          toggle();
          close();
        }}
        title={error ? 'Error' : 'Check In'}
        zIndex={20}
      >
        {response &&
          (isSuccessfulResponse(response) ? (
            <Stack justify='center' align='center' gap={20}>
              <LoadingOverlay
                visible={false}
                zIndex={200}
                overlayProps={{ blur: 2, radius: 'sm' }}
              />
              <Stack justify='center' align='center' gap={6}>
                <Avatar
                  size='35%'
                  src={response.app.user.image}
                  alt='User Profile'
                />
                <h1 className='text-3xl font-bold'>{response.app.user.name}</h1>
                <Text>University of Florida</Text>
              </Stack>
              <Text
                size='xl'
                style={{ color: getColor(response.app.status) }}
                td='underline'
              >
                {response.app.status}
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
          ) : (
            <Group justify='center'>
              <Text>{response.message}</Text>
            </Group>
          ))}
      </Modal>
      <Stack
        align='center'
        justify='center'
        className='rounded-lg border border-zinc-700 p-5'
      >
        <Box pos='relative'>
          <LoadingOverlay
            visible={visible}
            zIndex={10}
            overlayProps={{ radius: 'sm', blur: 3 }}
          />
          <QrScanner onScan={onScan} />
        </Box>
        <Group>
          <h1 className='text-2xl font-bold text-white'>
            {' '}
            Scan a QR Code to check in!{' '}
          </h1>
        </Group>
      </Stack>
    </Stack>
  );
}
