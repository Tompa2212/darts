'use client';

import React from 'react';
import { ZeroOneGame } from './zero-one-game';
import Link from 'next/link';
import { Heading } from '@/components/ui/heading';
import { gameSaver } from '@/lib/games-saver/game-saver';

type SavedCricketGameProps = {
  id: string;
};

export const SavedZeroOneGame = ({ id }: SavedCricketGameProps) => {
  const game = gameSaver.getGameByIdAndType(id, '01');

  if (!game) {
    return (
      <div className="flex h-full max-w-[1200px] flex-col gap-6 p-1 sm:p-4">
        <Heading Type="h2">Game not found.</Heading>
        <p>
          Play new game{' '}
          <Link className="text-blue-500" href="/play/zero-one">
            here
          </Link>
          .
        </p>
      </div>
    );
  }

  return <ZeroOneGame game={game} />;
};
