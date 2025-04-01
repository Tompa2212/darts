import { Heading } from '@/components/ui/heading';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const loading = () => {
  return (
    <div className="max-w-sm flex-1 px-2 py-2 xl:px-4 xl:py-4">
      <Heading className="mb-4">Create Zero One Match</Heading>
      <div className="space-y-4">
        <Skeleton className="h-2 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-2 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-2 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-2 w-24" />
        </div>
        <div className="space-y-2 pt-4">
          <Skeleton className="h-2 w-36" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  );
};

export default loading;
