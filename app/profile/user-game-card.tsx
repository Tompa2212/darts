import React from 'react';
import PlayerBadge from '@/components/player-badge';
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { UserPlayedGamesDto } from '@/data/games';

export function UserGameCard({
  game: {
    userWon,
    winningTeam,
    gameMode,
    detailsCricket,
    playedRounds,
    participants,
    statsCricketTeam
  }
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
          <CardDescription>Numbers: {detailsCricket?.numbers.join(', ')}</CardDescription>
          <CardDescription>
            <span className="text-lg">{playedRounds}</span> rounds
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        <Heading Type="h4">Teams</Heading>
        <ul className="flex flex-wrap items-center gap-x-4">
          {participants.map(({ team }) => (
            <li key={team.name} className="mb-2 py-1">
              <div className="mb-3 space-y-2">
                <p>
                  {winningTeam?.id === team.id && <span className="mr-1 inline-block">🏆</span>}
                  <span className="font-semibold">{team.name}</span>
                </p>
                <p className="text-sm text-zinc-500">
                  {statsCricketTeam?.find((stat) => stat.teamId === team.id)?.score} pts,{' '}
                  {statsCricketTeam
                    ?.find((stat) => stat.teamId === team.id)
                    ?.pointsPerRound.toFixed(2)}{' '}
                  per round{' '}
                </p>
              </div>
              <div className="space-x-2">
                {team.members.map((member) => (
                  <PlayerBadge key={member.userId || member.name} player={member}>
                    {member.name}
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
