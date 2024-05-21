'use client';
import QrScanner from '@/components/admin/QrScanner';
import { useCallback, useContext, useState } from 'react';
import { CompetitionContext } from '@/components/admin/AdminShell';

export default function ScanCheckIn() {
  const [result, setResult] = useState<string | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const { competition } = useContext(CompetitionContext);

  const onSubmit = async () => {
    if (!search) return; // Don't do anything if the user ID is empty
    
    const response = await fetch(`/api/comp/${competition?.code}/checkin/${search}`, {
      method: 'GET',
    });

    const data = await response.json();
    console.log(data);
  };

  // const onScan = async (result: string) => {
  //   setResult(result);
  //   setCameraActive(false);
  //   console.log('I was called!');

  //   if (!result) return; // Don't do anything if the user ID is empty

  //   const response = await fetch(
  //     `http://localhost:3000/api/user/find?uid=${result}`,
  //     {
  //       method: 'GET',
  //     }
  //   );

  //   const data = await response.json();
  //   if (data.status === 200) {
  //     console.log('User found!');
  //     console.log(
  //       `User ID: ${data.user.id}\nName: ${data.user.name}\nEmail: ${data.user.email}`
  //     );
  //   } else if (data.status === 404) {
  //     console.log(data.message);
  //   }
  // };

  return (
    <div className='flex w-full flex-col items-center justify-center border'>
      <input
        type='text'
        className='mb-5 h-10 w-1/3 border px-3'
        onChange={(event) => setSearch(event.target.value)}
      />
      <div
        onClick={onSubmit}
        className='flex h-[10%] w-[10%] select-none items-center justify-center bg-purple-500 text-white hover:cursor-pointer hover:bg-purple-300'
      >
        <p className='select-none'>Submit</p>
      </div>
      <h1>Competition Code: {competition?.code}</h1>
      <h1>Scanned: {result ? result : ''}</h1>
      {/* {cameraActive ? (
        <QrScanner onScan={onScan} />
      ) : (
        <h1>Camera is not active</h1>
      )}
      <h1>Scanned: {result ? result : ''}</h1>
      <div className='flex w-1/3 flex-row items-center justify-center'>
        <button
          onClick={() => {
            setCameraActive(true);
            setResult(null);
          }}
        >
          Reset
        </button>
      </div> */}
    </div>
  );
}
