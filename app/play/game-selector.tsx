import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import React from 'react';

export const GameSelector = () => {
  return (
    <div className="grid sm:grid-cols-2 gap-4 items-stretch *:self-stretch">
      <Link href="/play/cricket">
        <Card className="h-full hover:bg-zinc-50 transition-colors">
          <CardHeader className="sm:p-4">
            <Heading Type="h3">
              Cricket <span className="text-2xl inline-block mx-2">🎯</span>
            </Heading>
            <CardDescription>
              Be the first to close given numbers from the board and score the
              most points. Choose your own numbers or play standard mode.
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
      <Link href="/play/zero-one">
        <Card className="h-full hover:bg-zinc-50 transition-colors">
          <CardHeader className="sm:p-4">
            <Heading Type="h3">
              01 <span className="text-2xl inline-block mx-2">🎯</span>
            </Heading>
            <CardDescription>
              Be the first to reach exactly 0 points. Score points by hitting
              the board. Finish the game by hitting a double.
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
};
