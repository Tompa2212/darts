import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import React from 'react';
import { BackButton } from './back-button';

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonHref: string;
  backButtonLabel: string;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel
}: CardWrapperProps) => {
  return (
    <Card className="max-w-[500px] w-screen sm:w-[400px] shadow-none sm:shadow-md border-0 sm:border">
      <CardHeader>
        <h2 className="font-semibold text-xl">{headerLabel}</h2>
      </CardHeader>
      <CardContent>
        {children}
        <CardFooter>
          <BackButton href={backButtonHref} label={backButtonLabel} />
        </CardFooter>
      </CardContent>
    </Card>
  );
};
