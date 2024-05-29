'use client';

import { Input } from '@/components/ui/input';
import { cricketGameSaver } from '@/lib/games-saver/cricket-game-saver';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeMatchCard from './resume-match-card';

function ResumeMatchList() {
  const [games, setGames] = useState(cricketGameSaver.getSavedGames());
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
    const search = searchParams.get('team') || '';
    return game.teams.some((team) =>
      team.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <Input
        className="max-w-xl"
        placeholder="Search by team name..."
        type="text"
        value={searchParams.get('team') || ''}
        onChange={(e) => handleSearch(e.target.value)}
      />
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
    </div>
  );
}

export default ResumeMatchList;
