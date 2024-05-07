'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-4">
      <h2 className="text-3xl mb-4">{error.message}</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
