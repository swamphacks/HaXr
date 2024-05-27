'use client';
import QrScanner from '@/components/scan/QrScanner';
import CheckInModal from '@/components/checkin/CheckInModal';
import { type Application, type User, type Status } from '@prisma/client';
import { Box, Group, LoadingOverlay, Stack } from '@mantine/core';
import { useContext, useState } from 'react';
import { CompetitionContext } from '@/components/admin/AdminShell';
import { useDisclosure } from '@mantine/hooks';
import ErrorModal from '@/components/checkin/ErrorModal';

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
  response: apiResponse | null
): response is successResponse => {
  if (response === null) return false;
  return response.status === 200;
};

export default function ScanCheckIn() {
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [response, setResponse] = useState<apiResponse | null>(null);
  const [visible, { toggle }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);

  const { competition } = useContext(CompetitionContext);

  const onClose = () => {
    setCameraActive(true);
    setResponse(null);
    close();
    toggle();
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
      open();
    } else {
      open();
    }
  };

  return (
    <Stack gap='md' align='center' justify='flex-start'>
      {/* Modal pops up based on response*/}
      {isSuccessfulResponse(response) ? (
        <CheckInModal
          opened={opened}
          onClose={onClose}
          application={response}
        />
      ) : (
        <ErrorModal opened={opened} onClose={onClose} error={response} />
      )}
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
