import { Heading } from '@/components/ui/heading';
import protectedPage from '@/lib/protected-page';
import React from 'react';

export default async function Page501Mode() {
  await protectedPage();

  return (
    <div className="container py-4">
      <Heading>Coming Soon</Heading>
    </div>
  );
}
