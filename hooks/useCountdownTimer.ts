import { useEffect, useState } from 'react';

export interface LengthOfTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  duration: number;
}

const tillNow: LengthOfTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  duration: 0,
};

const timeTill = (date: Date): LengthOfTime => {
  const now = new Date();
  const diffSeconds = Math.ceil((date.getTime() - now.getTime()) / 1000);

  if (diffSeconds <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, duration: 0 };

  return {
    days: Math.floor(diffSeconds / (60 * 60 * 24)),
    hours: Math.floor((diffSeconds / (60 * 60)) % 24),
    minutes: Math.floor((diffSeconds / 60) % 60),
    seconds: Math.floor(diffSeconds % 60),
    duration: diffSeconds,
  };
};

const useCountdownTimer = (deadline: Date) => {
  const [complete, setCountdownComplete] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [timeLeft, setTimeLeft] = useState<LengthOfTime>(() => {
    // Initial calculation
    setIsInitialized(true);
    return timeTill(deadline);
  });

  useEffect(() => {
    // Escape if countdown is complete
    if (timeLeft.duration === 0) {
      setCountdownComplete(true);
      return;
    }

    // Wait some time and update the time left
    const timer = setTimeout(() => {
      setTimeLeft(timeTill(deadline));
    }, 1000);
  }, [timeLeft, deadline]);

  return { timeLeft, complete, isInitialized };
};

export default useCountdownTimer;
