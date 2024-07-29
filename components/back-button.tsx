'use client';
import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { useRouter } from 'next/navigation';
import { Icon } from './ui/icon';

export const BackButton = (props: ButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className="px-0 hover:bg-transparent"
      onClick={() => {
        router.back();
      }}
      {...props}
    >
      <Icon name="MoveLeft" className="h-4 w-4 mr-2" /> Back
    </Button>
  );
};
