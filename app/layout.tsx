import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import React from 'react';

const RalewayRegular = Raleway({
  display: 'swap',
  subsets: ['latin'],
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: 'SwampHacks X',
  description: "SwampHacks X's website and login portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={RalewayRegular.className}>{children}</body>
    </html>
  );
}
