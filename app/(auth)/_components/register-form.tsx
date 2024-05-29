'use client';

import React from 'react';
import { CardWrapper } from './card-wrapper';

export const RegisterForm = () => {
  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonHref="/login"
      backButtonLabel="Already have an account?"
      showSocial
    >
      <p className="text-zinc-500">Signup through google account</p>
    </CardWrapper>
  );
};
