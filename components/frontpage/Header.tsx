import swampHacksLogo from '@/public/logos/swamphacks_code_logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

// TODO: fix this (use components); tailwind-prettier doesn't recognize this string
const headerLink =
  'group flex-col items-center text-xl opacity-65 transition duration-200 hover:opacity-100 select-none hidden xl:flex';
const headerLinkUnderline =
  'duration-350 h-0.5 w-0 bg-white transition-all group-hover:w-full';

const Header = () => {
  return (
    <header className='border-green flex h-20 w-full  flex-row items-center bg-black bg-opacity-75 px-6 text-white'>
      <div className='flex select-none flex-row items-center justify-between gap-10 sm:justify-start'>
        <a href='/'>
          <Image
            priority
            className='w-32 fill-amber-700'
            src={swampHacksLogo}
            alt='SwampHacks Logo'
          />
        </a>
        <Link href='/'>
          <p className='text-3xl font-bold'>SwampHacks X</p>
        </Link>
        <Link className={headerLink} href='#'>
          Schedule
          <span className={headerLinkUnderline}></span>
        </Link>
        <Link className={headerLink} href='#'>
          Sponsors
          <span className={headerLinkUnderline}></span>
        </Link>
        <Link className={headerLink} href='#'>
          Apply
          <span className={headerLinkUnderline}></span>
        </Link>
        <Link className={headerLink} href='#'>
          FAQ
          <span className={headerLinkUnderline}></span>
        </Link>
      </div>
      <div className='flex grow flex-row justify-end'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
