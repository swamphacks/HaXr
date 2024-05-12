import { BrowserMultiFormatReader } from '@zxing/library';
import React, { useEffect, useRef } from 'react';

interface QrScannerProps {
  onScan: (result: string) => void;
}

const QrScanner = ({ onScan }: QrScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: 'environment',
        },
      },
      videoRef.current,
      (result, error) => {
        if (result) onScan(result.getText());
      }
    );

    return () => {
      reader.current.reset();
    };
  }, [videoRef, onScan]);

  return <video ref={videoRef} />;
};

export default QrScanner;
