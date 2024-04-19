import { Raleway } from 'next/font/google';
import swampHacksLogo from '@/public/logos/swamphacks_code_logo.svg';
import Image from 'next/image';

const ralewayBold = Raleway({
  display: 'swap',
  subsets: ['latin'],
  weight: ['700'],
});

const ralewayRegular = Raleway({
  display: 'swap',
  subsets: ['latin'],
  weight: ['500'],
});

const Header = () => {
  return (
    <header className='border-green flex h-24 w-full flex-row items-center  bg-black bg-opacity-75 pl-6 pr-6 text-white'>
      <div className='flex flex-1 flex-row items-center justify-between'>
        <Image
          priority
          className='h-40 w-40'
          src={swampHacksLogo}
          alt='SwampHacks Logo'
        />
        <p className={`${ralewayBold.className} text-4xl`}>Swamphacks X</p>
        <a className={`${ralewayRegular.className} text-2xl`} href='#'>
          Schedule
        </a>
        <a className={`${ralewayRegular.className} text-2xl`} href='#'>
          Sponsors
        </a>
        <a className={`${ralewayRegular.className} text-2xl`} href='#'>
          Apply
        </a>
        <a className={`${ralewayRegular.className} text-2xl`} href='#'>
          FAQ
        </a>
      </div>
      <div className='flex flex-1 flex-row justify-end'>
        <a className={`${ralewayRegular.className} text-2xl`} href='#'>
          Sign-In
        </a>
      </div>
    </header>
  );
};

export default Header;
