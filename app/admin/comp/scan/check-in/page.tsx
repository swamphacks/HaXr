'use client';
import QrScanner from '@/components/scan/QrScanner';
import CheckInModal from '@/components/checkin/CheckInModal';
import { type Application, type User } from '@prisma/client';
import {
  Box,
  Button,
  Divider,
  Group,
  Input,
  LoadingOverlay,
  Stack,
} from '@mantine/core';
import { useContext, useEffect, useRef, useState } from 'react';
import { CompetitionContext } from '@/components/admin/AdminShell';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

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
  const [visible, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);
  const [opened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const inputRef = useRef(null);
  const { competition } = useContext(CompetitionContext);

  const onClose = () => {
    setCameraActive(true);
    setResponse(null);
    close();
    closeLoading();
  };

  const onScan = async (result: string | null) => {
    if (result === null || result.trim() === '') return;

    // Already doing something else
    if (!cameraActive) return;

    // If currently scanning...
    setCameraActive(false);
    openLoading();

    const res = await (
      await fetch(`/api/comp/${competition?.code}/application/${result}`)
    ).json();

    setResponse(res);

    // Handling modal opening and error notifications
    if (res === null) return;

    if (isSuccessfulResponse(res)) openModal();
    else {
      notifications.show({
        title: 'Error',
        message: res?.message,
        color: 'red',
        autoClose: 6000,
      });

      setCameraActive(true);
      closeLoading();
    }
  };
  open;

  return (
    <Stack gap='md' align='center' justify='flex-start' w='100%'>
      {/* Modal pops up based on response*/}
      {isSuccessfulResponse(response) ? (
        <CheckInModal
          opened={opened}
          onClose={onClose}
          application={response}
        />
      ) : (
        <></>
      )}

      <Stack
        align='center'
        justify='center'
        className='rounded-lg border border-zinc-700 p-5'
      >
        <Box pos='relative' h='100%'>
          <LoadingOverlay
            visible={visible}
            zIndex={10}
            overlayProps={{ radius: 'sm', blur: 3 }}
          />
          <QrScanner onScan={onScan} />
        </Box>
        <Group>
          <h1 className='text-xl font-bold text-white md:text-2xl'>
            {' '}
            Scan a QR Code to check in!{' '}
          </h1>
        </Group>
      </Stack>
      <Divider
        label={<p className='text-xl'>or</p>}
        labelPosition='center'
        size='md'
        w='50%'
      />

      <Stack
        pos='relative'
        justify='center'
        align='center'
        className='w-5/6 md:w-3/4 lg:w-1/3'
      >
        <LoadingOverlay
          visible={visible}
          zIndex={10}
          overlayProps={{ radius: 'sm', blur: 3 }}
        />
        <Input.Wrapper label='Manual Check In' w='100%'>
          <Input placeholder='Enter User ID' ref={inputRef} />
        </Input.Wrapper>
        <Button
          onClick={() => {
            //@ts-ignore
            // Weird never type on inputRef.current
            if (inputRef.current !== null) onScan(inputRef.current.value);
          }}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
}
