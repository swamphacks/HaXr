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

  return (
    <div className='relative flex h-[70vh] items-center justify-center'>
      <video ref={videoRef} className='h-full w-full' />
      <div className='absolute h-[30vh] w-[30vh] border'></div>
    </div>
  );
};

export default QrScanner;
