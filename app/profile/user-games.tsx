import { getUserPlayedGames } from '@/data/games';
import React from 'react';
import { UserGameCard } from './user-game-card';
import { Skeleton } from '@/components/ui/skeleton';

export default async function UserGamesList() {
  const games = await getUserPlayedGames();

  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {games.map((game) => (
        <UserGameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export function UserGamesListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[205px] w-full rounded-xl" />
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
