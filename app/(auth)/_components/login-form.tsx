'use client';

import React from 'react';
import { CardWrapper } from './card-wrapper';
import { useSearchParams } from 'next/navigation';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? "You're already registered with this email. Please login with your social account."
      : '';
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    >
      <p className="text-zinc-500">Login With Google</p>
    </CardWrapper>
  );
};
