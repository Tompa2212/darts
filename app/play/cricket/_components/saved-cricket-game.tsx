'use client';

import React from 'react';
import { CricketGame } from './cricket-game';
import Link from 'next/link';
import { Heading } from '@/components/ui/heading';
import { cricketGameSaver } from '@/lib/games-saver/cricket-game-saver';

type SavedCricketGameProps = {
  id: string;
};

export const SavedCricketGame = ({ id }: SavedCricketGameProps) => {
  const game = cricketGameSaver.getGame(id);

  if (!game) {
    return (
      <div className="flex h-full max-w-[1200px] flex-col gap-6 p-1 sm:p-4">
        <Heading Type="h2">Game not found.</Heading>
        <p>
          Play new game{' '}
          <Link className="text-blue-500" href="/play/cricket">
            here
          </Link>
          .
        </p>
      </div>
    );
  }

  return <CricketGame game={game} />;
};
