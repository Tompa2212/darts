import React from 'react';
import PlayerBadge from '@/components/player-badge';
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { UserPlayedGamesDto } from '@/data/games';

export function UserGameCard({
  game: { userWon, winner, gameMode, numbers, playedRounds, gameTeams }
}: {
  game: UserPlayedGamesDto;
}) {
  return (
    <Card className={cn('h-full border-red-400/40', userWon && 'border-green-400/40')}>
      <CardHeader className="p-4">
        <Heading Type="h3" className="capitalize">
          {gameMode}
        </Heading>
        <div className="flex items-end justify-between">
          <CardDescription>Numbers: {numbers.join(', ')}</CardDescription>
          <CardDescription>
            <span className="text-lg">{playedRounds}</span> rounds
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <Heading Type="h4">Teams</Heading>
        <ul className="flex flex-wrap items-center gap-x-4">
          {gameTeams.map(({ team, score, pointsPerRound }) => (
            <li key={team.name} className="mb-2 py-1">
              <div className="mb-3 space-y-2">
                <p>
                  {winner.id === team.id && <span className="mr-1 inline-block">🏆</span>}
                  <span className="font-semibold">{team.name}</span>
                </p>
                <p className="text-sm text-zinc-500">
                  {score} pts, {pointsPerRound.toFixed(2)} per round{' '}
                </p>
              </div>
              <div className="space-x-2">
                {team.players.map((player) => (
                  <PlayerBadge key={player.userId || player.name} player={player}>
                    {player.name}
                  </PlayerBadge>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
