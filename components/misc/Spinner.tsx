'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Spinner = () => {
  const [message, setMessage] = useState<string>('');
  const messageList = [
    'Warming up the servers!',
    'Retrieving mission critical data!',
    'Did you know? Alligators build nests like birds!',
    'Tip: You can earn more points by attending workshops!',
    'Ｏ(≧∇≦)Ｏ',
    "It's great ... to be ... a Florida Gator!",
    'Celebrating a decade of SwampHacks!',
    'Tip: Hackers who sleep are more productive!',
    'Light mode attracts bugs! 🐛',
  ];

  const shuffleMessages = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const shuffledMessages = shuffleMessages(messageList);
    setMessage(shuffledMessages[0]);

    let i = 1;
    const interval = setInterval(() => {
      setMessage(shuffledMessages[i]);
      i = i === shuffledMessages.length - 1 ? 0 : i + 1;
      console.log(i);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center gap-5 md:gap-6 lg:gap-7'>
      <div className=' flex h-16 w-16 flex-row items-center justify-between gap-2 sm:h-20 sm:w-20 sm:gap-3 md:h-24 md:w-24'>
        <motion.div
          animate={{ height: ['66%', '100%', '66%', '66%', '66%', '66%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className='h-2/3 w-1/3 bg-white'
        ></motion.div>
        <motion.div
          animate={{ height: ['66%', '100%', '66%', '66%', '66%', '66%'] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.1,
            ease: 'easeInOut',
          }}
          className='h-2/3 w-1/3 bg-white'
        ></motion.div>
        <motion.div
          animate={{ height: ['66%', '100%', '66%', '66%', '66%', '66%'] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.2,
            ease: 'easeInOut',
          }}
          className='h-2/3 w-1/3 bg-white'
        ></motion.div>
      </div>
      <p className='text-center text-sm text-zinc-300 md:text-xl lg:text-2xl'>
        {message}
      </p>
    </div>
  );
};

export default Spinner;
