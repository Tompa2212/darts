'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const RegisterForm = () => {
  const router = useRouter();
  const onSignIn = () => {
    router.push('/api/auth/google/signin');
  };

  return (
    <div className="space-y-6">
      <p className="text-text-light-secondary">Sign up to start playing</p>
      <Button className="w-full" size="lg" variant="outline" onClick={onSignIn}>
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
        Already have an account?{' '}
        <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
};
