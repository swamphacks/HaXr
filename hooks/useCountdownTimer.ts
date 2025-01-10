import { useEffect, useState } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const useCountdownTimer = (deadline: Date) => {
  const [countdownComplete, setCountdownComplete] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const calculateTimeLeft = (): CountdownState => {
    const now = new Date();
    const difference = deadline.getTime() - now.getTime();

    if (difference <= 0) {
      setCountdownComplete(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownState>(() => {
    // Initial calculation
    const initial = calculateTimeLeft();
    setIsInitialized(true);
    return initial;
  });

  useEffect(() => {
    // Immediate check on mount
    const checkTime = () => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);

      // Check if countdown is complete
      const isComplete =
        updatedTime.days === 0 &&
        updatedTime.hours === 0 &&
        updatedTime.minutes === 0 &&
        updatedTime.seconds === 0;

      if (isComplete) {
        setCountdownComplete(true);
      }

      return isComplete;
    };

    // Initial check
    const isComplete = checkTime();

    // Only set interval if not complete
    if (!isComplete) {
      const interval = setInterval(checkTime, 1000);
      return () => clearInterval(interval);
    }
  }, [deadline]);

  return { timeLeft, countdownComplete, isInitialized };
};

export default useCountdownTimer;
