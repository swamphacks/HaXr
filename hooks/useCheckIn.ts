import useSWR from 'swr';
import { type Attendees } from '@prisma/client';
import { useState, useCallback, useEffect } from 'react';

interface checkInSuccess {
  attendee: Attendees;
  status: number;
}

interface checkInError {
  message: string;
  status: number;
}

type checkInDataType = checkInError | checkInSuccess | null;

type checkInType = 'success' | 'error' | 'none';

// Type guard
const okCheckInResponse = (
  response: checkInDataType
): response is checkInSuccess => {
  return response?.status === 200;
};

const useCheckIn = (code: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [checkInStatus, setCheckInStatus] = useState<checkInType>('none');
  const [checkInData, setCheckInData] = useState<checkInDataType>(null);

  const checkInHacker = async (userId: string) => {
    setLoading(true);
    setCheckInData(null);
    setCheckInStatus('none');
    1;
    const response = await (
      await fetch(`/api/comp/${code}/checkin/${userId}`, {
        method: 'POST',
      })
    ).json();

    setCheckInData(response);

    if (okCheckInResponse(response)) setCheckInStatus('success');
    else setCheckInStatus('error');

    setLoading(false);
  };

  return {
    checkInHacker,
    loading,
    checkInData,
    checkInStatus,
    setCheckInData,
    okCheckInResponse,
  };
};

export default useCheckIn;
