'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import Link from 'next/link';

export const LoginForm = () => {
  const router = useRouter();

  const onSignIn = () => {
    router.push('/api/auth/google/signin');
  };

  return (
    <div className="space-y-6">
      <Button size="lg" className="w-full" variant="outline" onClick={onSignIn}>
        <GoogleIcon className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="text-text-light-secondary bg-white px-2">Or</span>
        </div>
      </div>

      <div className="text-text-light-secondary text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-500 hover:text-primary-600 font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
};
