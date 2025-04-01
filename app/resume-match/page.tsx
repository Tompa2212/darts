import React, { Suspense } from 'react';

import { Heading } from '@/components/ui/heading';
import ResumeMatchList, { ResumeMatchListSkeleton } from './resume-match-list';
import protectedPage from '@/lib/protected-page';

export const metadata = {
  title: 'Resume Match'
};

export default async function ResumeMatchPage() {
  await protectedPage();

  return (
    <div className="container space-y-4 py-4">
      <Heading Type="h1">Resume Saved Match</Heading>
      <Suspense fallback={<ResumeMatchListSkeleton />}>
        <ResumeMatchList />
      </Suspense>
    </div>
  );
}
