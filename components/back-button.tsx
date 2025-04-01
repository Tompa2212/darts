'use client';
import React from 'react';
import { Button, ButtonProps } from './ui/button';
import { useRouter } from 'next/navigation';
import { MoveLeftIcon } from 'lucide-react';

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
      <MoveLeftIcon className="mr-2 h-4 w-4" /> Back
    </Button>
  );
};
