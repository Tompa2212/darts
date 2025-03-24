import { Heading } from '@/components/ui/heading';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const loading = () => {
  return (
    <div className="flex-1 px-2 xl:px-4 py-2 xl:py-4 max-w-sm">
      <Heading className="mb-4">Create Zero One Match</Heading>
      <div className="space-y-4">
        <Skeleton className="h-2 w-24" />
        <div className="flex gap-2 items-center">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-2 w-20" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-2 w-24" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-2 w-24" />
        </div>
        <div className="space-y-2 pt-4">
          <Skeleton className="w-36 h-2" />
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    </div>
  );
};

export default loading;
