'use client';

import React from 'react';
import { CardWrapper } from './card-wrapper';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';

export const LoginForm = () => {
  const router = useRouter();

  const onSignIn = () => {
    router.push('/api/auth/google/signin');
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      <div className="space-y-2">
        <p className="text-zinc-500 ">Login With Google</p>
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
