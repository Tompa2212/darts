'use client';

import { Input } from '@/components/ui/input';
import { cricketGameSaver } from '@/lib/games-saver/cricket-game-saver';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeMatchCard from './resume-match-card';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';

function ResumeMatchList() {
  const [games, setGames] = useState(cricketGameSaver.getSavedGames());
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const teamSearch = searchParams.get('team');

  function handleDeleteGame(gameId: string) {
    cricketGameSaver.removeGame(gameId);
    setGames(cricketGameSaver.getSavedGames());
  }

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set('team', value);
    } else {
      params.delete('team');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const filteredGames = games.filter((game) => {
    const search = teamSearch || '';
    return game.teams.some((team) =>
      team.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  let emptyMessage: React.ReactNode | null = null;

  if (filteredGames.length === 0) {
    emptyMessage = teamSearch ? (
      <Heading>No games found</Heading>
    ) : (
      <div>
        <Heading className="mb-2">No saved games</Heading>
        <p>
          Click{' '}
          <Link
            className="text-blue-800 underline underline-offset-2"
            href="/play"
          >
            here
          </Link>{' '}
          to play some games.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Input
        className="max-w-xl"
        placeholder="Search by team name..."
        type="text"
        defaultValue={searchParams.get('team')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {emptyMessage ? (
        emptyMessage
      ) : (
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-4"
        >
          <AnimatePresence>
            {filteredGames.map((game) => (
              <ResumeMatchCard
                key={game.id}
                game={game}
                onDeleteGame={handleDeleteGame}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default ResumeMatchList;
