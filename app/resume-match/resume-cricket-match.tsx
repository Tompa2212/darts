import React from 'react';
import PlayerBadge from '@/components/player-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';

import { CricketGameType } from '@/packages/cricket-game';
import Link from 'next/link';
import { XIcon } from 'lucide-react';

type ResumeCricketMatchProps = {
  game: CricketGameType;
  onDeleteGame: (gameId: string) => void;
};

function ResumeCricketMatch({ game, onDeleteGame }: ResumeCricketMatchProps) {
  return (
    <Link href={`/play/cricket?gameId=${game.id}`} className="h-full">
      <Card className="h-full">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle>Cricket Game</CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onDeleteGame(game.id);
              }}
            >
              <XIcon className="size-6 stroke-red-500" />
            </Button>
          </div>
          <CardDescription>Numbers: {game.numbers.join(', ')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          <Heading Type="h4">Teams</Heading>
          <ul className="flex flex-wrap items-center gap-x-4">
            {game.teams.map((team) => (
              <li key={team.name} className="mb-2 py-1">
                <p className="mb-2">
                  <span className="text-zinc-500 italic">{team.name}</span>, {team.points} points
                </p>
                <div className="space-x-2">
                  {team.players.map((player) => (
                    <PlayerBadge key={player.id || player.name} player={player}>
                      {player.name}
                    </PlayerBadge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ResumeCricketMatch;
