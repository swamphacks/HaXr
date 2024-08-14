import type { Metadata } from 'next';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { Notifications } from '@mantine/notifications';

export const metadata: Metadata = {
  title: 'SwampHacks Portal',
  description: 'SwampHacks portal for Hackers and Admins!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang='en'>
        <Head>
          <ColorSchemeScript />
        </Head>
        <body>
          <MantineProvider defaultColorScheme='dark'>
            <Notifications />
            {children}
          </MantineProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
