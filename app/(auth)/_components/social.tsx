'use client';

import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import { useRouter } from 'next/navigation';

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const router = useRouter();

  const onClick = (provider: 'google' | 'github') => {
    router.push('/api/auth/google/signin');
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick('google')}
      >
        <GoogleIcon name="Chrome" className="h-5 w-5" />
      </Button>
    </div>
  );
};
