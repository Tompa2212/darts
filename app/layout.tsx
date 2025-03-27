import type { Metadata } from 'next';
import './globals.css';
import clsx from 'clsx';
import Providers from '@/providers/providers';
import { Navbar } from '@/components/navbar/navbar';
import { inter } from './fonts';

export const metadata: Metadata = {
  title: 'Bullseye Buddy',
  description: 'Application for playing and keeping track of darts scores',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['darts', 'darts cricket', 'darts scores', 'play darts'],
  icons: [
    { rel: 'apple-touch-icon', url: 'darts-apple.png' },
    { rel: 'icon', url: 'darts.png' }
  ]
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, 'flex h-screen! flex-col')}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
