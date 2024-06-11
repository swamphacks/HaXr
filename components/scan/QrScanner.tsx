import { BrowserCodeReader, IScannerControls } from '@zxing/browser';
import React, { useEffect, useRef } from 'react';
import { QRCodeReader } from '@zxing/library';
import { Paper } from '@mantine/core';

interface Props {
  onScan: (result: string) => void;
}

export default function QrScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const reader = useRef(
    new BrowserCodeReader(new QRCodeReader(), new Map(), {
      delayBetweenScanSuccess: 1000,
    })
  );

  const controls = useRef<Promise<IScannerControls>>();

  useEffect(() => {
    if (!videoRef.current) return;

    const currReader = reader.current;

    if (!controls.current) {
      controls.current = currReader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (r) => {
          if (r) onScan(r.getText());
        }
      );
    }
  }, [onScan, controls]);

  return (
    <Paper radius='md' maw={650}>
      <video ref={videoRef} style={{ borderRadius: 'inherit' }} />
    </Paper>
  );
}
