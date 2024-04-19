import type { Metadata } from 'next';
import Header from '@/components/header';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swamphacks X',
  description:
    "Welcome to Swamphacks X! The 10th iteration of the University of Florida's premier hackathon. Join us for 36 hours of hacking, workshops, and fun!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
