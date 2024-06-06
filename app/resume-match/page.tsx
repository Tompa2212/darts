import React, { Suspense } from 'react';

import { Heading } from '@/components/ui/heading';
import ResumeMatchList from './resume-match-list';

const ResumeMatchPage = () => {
  return (
    <div className="container py-4 space-y-4">
      <Heading Type="h1">Resume Saved Match</Heading>
      <Suspense>
        <ResumeMatchList />
      </Suspense>
    </div>
  );
};

export default ResumeMatchPage;
