'use client';

import React from 'react';
import { CardWrapper } from './card-wrapper';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import { useRouter } from 'next/navigation';

export const RegisterForm = () => {
  const router = useRouter();
  const onSignIn = () => {
    router.push('/api/auth/google/signin');
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonHref="/login"
      backButtonLabel="Already have an account?"
    >
      <div className="space-y-2">
        <p className="text-zinc-500">Signup through google account</p>
        <div className="flex items-center w-full gap-x-2">
          <Button
            size="lg"
            className="w-full"
            variant="outline"
            onClick={onSignIn}
          >
            <GoogleIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};
