import './globals.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

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
            <ModalsProvider>
              <DatesProvider settings={{ timezone: 'EST' }}>
                <Notifications />
                {children}
              </DatesProvider>
            </ModalsProvider>
          </MantineProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
