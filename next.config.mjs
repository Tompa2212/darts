import nextPwa from 'next-pwa';

const withPWA = nextPwa({
  dest: 'public', // Destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development',
  register: true, // Register the PWA service worker
  skipWaiting: true // Skip waiting for service worker activation
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'critics.io',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  }
};

export default withPWA(nextConfig);
