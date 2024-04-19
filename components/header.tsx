'use client';
import { useState } from 'react';
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

const headerLink = `${ralewayRegular.className} group flex-col items-center text-2xl opacity-85 transition duration-200 hover:opacity-100 select-none hidden xl:flex`;
const headerLinkUnderline =
  'duration-350 h-0.5 w-0 bg-white bg-opacity-75 transition-all group-hover:w-full';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); // For hamburger menu for mobile

  return (
    <header className='border-green flex h-24 w-full flex-row items-center  bg-black bg-opacity-75 pl-6 pr-6 text-white'>
      <div className='flex select-none flex-row items-center justify-between gap-10 sm:justify-start'>
        <a href='/'>
          <Image
            priority
            className='h-40 w-40'
            src={swampHacksLogo}
            alt='SwampHacks Logo'
          />
        </a>
        <p className={`${ralewayBold.className} text-4xl`}>Swamphacks X</p>
        <a className={headerLink} href='#'>
          Schedule
          <span className={headerLinkUnderline}></span>
        </a>
        <a className={headerLink} href='#'>
          Sponsors
          <span className={headerLinkUnderline}></span>
        </a>
        <a className={headerLink} href='#'>
          Apply
          <span className={headerLinkUnderline}></span>
        </a>
        <a className={headerLink} href='#'>
          FAQ
          <span className={headerLinkUnderline}></span>
        </a>
      </div>
      <div className='flex grow flex-row justify-end'>
        <a className={headerLink} href='#'>
          Sign-In
          <span className={headerLinkUnderline}></span>
        </a>
      </div>
    </header>
  );
};

export default Header;
