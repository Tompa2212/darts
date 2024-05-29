import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import React, { Suspense } from 'react';
import { BackButton } from './back-button';
import { Social } from './social';

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocial?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocial
}: CardWrapperProps) => {
  return (
    <Card className="max-w-[500px] w-screen sm:w-[400px] shadow-none sm:shadow-md border-0 sm:border">
      <CardHeader>
        <h2 className="font-semibold text-xl">{headerLabel}</h2>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Suspense>
            <Social />
          </Suspense>
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};
