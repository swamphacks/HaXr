import { BrowserMultiFormatReader } from '@zxing/library';
import React, { useEffect, useRef, useState } from 'react';

interface QrScannerProps {
  onScan: (result: string) => void;
}

const QrScanner = React.memo(({ onScan }: QrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (!videoRef.current) return;

    const current = reader.current;

    current.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: 'environment',
        },
      },

      videoRef.current,
      (result) => {
        if (result) onScan(result.getText());
      }
    );

    return () => {
      current.reset();
    };
  }, [videoRef, onScan]);

  return <video ref={videoRef} />;
});

QrScanner.displayName = 'QrScanner';

export default QrScanner;
