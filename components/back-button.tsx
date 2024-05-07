'use client';
import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { useRouter } from 'next/navigation';

export const BackButton = (props: ButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant="link"
      className="px-0"
      onClick={() => {
        router.back();
      }}
      {...props}
    >
      &#8592; Back
    </Button>
  );
};
