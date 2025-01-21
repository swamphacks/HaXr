import { BrowserCodeReader, IScannerControls } from '@zxing/browser';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { QRCodeReader } from '@zxing/library';
import { ActionIcon, Group, Paper, Select } from '@mantine/core';
import { IconFlipVertical } from '@tabler/icons-react';
import { useLocalStorage } from '@mantine/hooks';

interface Props {
  onScan: (result: string) => void;
  rememberAs?: string;
}

interface CameraInfo {
  deviceId: string | null;
  flip: boolean;
}

const getCameras = async () =>
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) =>
      devices.filter((device) => device.kind === 'videoinput')
    );

export default function QrScanner({ onScan, rememberAs }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(
    new BrowserCodeReader(new QRCodeReader(), new Map(), {
      delayBetweenScanSuccess: 1000,
    })
  );

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [camera, setCamera] = useLocalStorage<CameraInfo | null>({
    key: rememberAs || 'qr-scanner-device',
    defaultValue: null,
  });
  // const [deviceId, setDeviceId] = useState<string | null>(null);
  const controls = useRef<IScannerControls | null>(null);

  // Run on component mount
  useEffect(() => {
    async function setup() {
      // Get all cameras
      const cameras = await getCameras();
      setDevices(cameras);
    }

    setup();
  }, [camera]);

  // Run when we change which camera we are using
  const changeCamera = useCallback(
    async (deviceId: string | null) => {
      console.log('Change Camera');
      // If we have no device ID or video ref, do nothing
      if (!videoRef.current) return;

      // Cleanup the old controls
      if (controls.current) controls.current.stop();

      // Grab the new ones
      if (deviceId) {
        controls.current = await reader.current.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result) => {
            if (result) onScan(result.getText());
          }
        );
      } else controls.current = null;
    },
    [onScan]
  );

  useEffect(() => {
    changeCamera(camera?.deviceId || null);
  }, [changeCamera, camera]);

  return (
    <Paper radius='md' maw={500}>
      <Group justify='space-between' mb='sm' align='flex-end'>
        <Select
          label='Select Camera'
          value={camera?.deviceId || null}
          onChange={(deviceId) =>
            setCamera({ deviceId, flip: camera?.flip ?? false })
          }
          data={devices.map((device) => ({
            value: device.deviceId,
            label: device.label,
          }))}
          style={{ flexGrow: 1 }}
          clearable
        />

        <ActionIcon
          size='lg'
          onClick={() =>
            setCamera(camera ? { ...camera, flip: !camera.flip } : null)
          }
        >
          <IconFlipVertical />
        </ActionIcon>
      </Group>

      <video
        ref={videoRef}
        style={{ borderRadius: 'inherit', scale: `${camera?.flip ? -1 : 1} 1` }}
      />
    </Paper>
  );
}
