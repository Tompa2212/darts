import PlayerBadge from '@/components/player-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { CricketGameType } from '@/packages/cricket-game';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

type ResumeMatchCardProps = {
  game: CricketGameType;
  onDeleteGame: (gameId: string) => void;
};

export default function ResumeMatchCard({
  game,
  onDeleteGame
}: ResumeMatchCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      layout
    >
      <Link href={`/play/cricket?gameId=${game.id}`} className="h-full">
        <Card className="h-full">
          <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <CardTitle>Cricket Game</CardTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteGame(game.id);
                }}
              >
                <Icon name="X" className="stroke-red-500" />
              </Button>
            </div>
            <CardDescription>
              Numbers: {game.numbers.join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            <Heading Type="h4">Teams</Heading>
            <ul className="flex flex-wrap items-center gap-x-4">
              {game.teams.map((team) => (
                <li key={team.name} className="mb-2 py-1">
                  <p className="mb-2">
                    <span className="italic text-zinc-500">{team.name}</span>,{' '}
                    {team.points} points
                  </p>
                  <div className="space-x-2">
                    {team.players.map((player) => (
                      <PlayerBadge
                        key={player.id || player.name}
                        player={player}
                      >
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
    </motion.div>
  );
}
