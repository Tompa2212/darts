'use client';

import { Input } from '@/components/ui/input';
import { cricketGameSaver } from '@/lib/games-saver/cricket-game-saver';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeMatchCard from './resume-match-card';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Label } from '@/components/ui/label';

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
      <>
        <div className="mb-4">
          <Heading>No games found</Heading>
          <p className="text-muted-foreground">
            We couldn&apos;t find any games for the team {`"${teamSearch}"`}
          </p>
        </div>
        <Icon
          name="SearchX"
          className="h-20 w-20 mx-auto stroke-muted-foreground"
        />
      </>
    ) : (
      <>
        <div className="mb-4">
          <Heading className="mb-2">You have no saved games</Heading>
          <p className="text-muted-foreground">
            Games will be automatically saved when you start a new game.
          </p>
        </div>
        <Link href="/play" className={cn(buttonVariants())}>
          Play
        </Link>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <Label htmlFor="team" className="mb-1">
          Team
        </Label>
        <Input
          type="text"
          id="team"
          className="max-w-xl"
          placeholder="Search by team name..."
          defaultValue={searchParams.get('team')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {emptyMessage ? (
        <div className="text-center mt-[6vh] sm:mt-[17vh]">{emptyMessage}</div>
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
