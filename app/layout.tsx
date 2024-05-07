import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';
import Providers from '@/providers/providers';
import { Navbar } from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Darts Scoreboard',
  description: 'Application for playing and keeping track of darts scores',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['darts', 'darts cricket', 'darts scores', 'play darts'],
  icons: [
    { rel: 'apple-touch-icon', url: 'next.svg' },
    { rel: 'icon', url: 'next.svg' }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, 'flex h-screen flex-col')}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
