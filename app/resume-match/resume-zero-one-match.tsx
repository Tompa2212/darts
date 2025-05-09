import { ZeroOneGameType } from '@/packages/zero-one';
import React from 'react';
import PlayerBadge from '@/components/player-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import Link from 'next/link';
import { XIcon } from 'lucide-react';

type ResumeZeroOneMatchProps = {
  game: ZeroOneGameType;
  onDeleteGame: (gameId: string) => void;
};

const ResumeZeroOneMatch = ({ game, onDeleteGame }: ResumeZeroOneMatchProps) => {
  return (
    <Link href={`/play/zero-one?gameId=${game.id}`} className="h-full">
      <Card className="h-full">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle>01 Game</CardTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onDeleteGame(game.id);
              }}
            >
              <XIcon name="X" className="size-6 stroke-red-500" />
            </Button>
          </div>
          <CardDescription>Type: {game.type}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          <Heading Type="h4">Teams</Heading>
          <ul className="flex flex-wrap items-center gap-x-4">
            {game.teams.map((team) => (
              <li key={team.name} className="mb-2 py-1">
                <p className="mb-2">
                  <span className="text-zinc-500 italic">{team.name}</span>, {team.score} points
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
};

export default ResumeZeroOneMatch;
