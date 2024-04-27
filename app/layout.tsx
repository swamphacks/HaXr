import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'SwampHacks X',
  description: 'SwampHacks portal for Hackers and Admins!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
