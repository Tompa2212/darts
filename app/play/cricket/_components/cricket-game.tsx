'use client';
import React, { useEffect } from 'react';
import { useCricketGame } from '../_hooks/use-cricket-game';
import { ScoresTable } from './scores-table';
import PlayControls from './play-controls';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  DialogResponsiveContent,
  DialogResponsiveFooter,
  DialogResponsiveHeader,
  DialogResponsive
} from '@/components/ui/dialog-responsive';
import { Team } from '@/packages/cricket-game';

type CricketGameProps = {
  randomNums: boolean;
  teams: Team[];
  numbers?: number[];
};

export const CricketGame = ({
  randomNums,
  numbers,
  teams
}: CricketGameProps) => {
  const {
    game,
    canRedo,
    canUndo,
    currentTeam,
    finishTurn,
    throwDart,
    undoThrow,
    undoTurn,
    redoTurn,
    replayGame
  } = useCricketGame({
    useRandomNums: randomNums,
    numbers,
    teams
  });

  const [showReplay, setShowReplay] = React.useState(false);

  useEffect(() => {
    if (game.isFinished) {
      setShowReplay(true);
    } else {
      setShowReplay(false);
    }
  }, [game]);

  return (
    <>
      <DialogResponsive open={showReplay} onOpenChange={(open) => {}}>
        <DialogResponsiveContent>
          <DialogResponsiveHeader>
            <h2 className="text-2xl">Game finished!</h2>
          </DialogResponsiveHeader>
          <div>
            <p className="mb-4">{game.winner?.name} won the game!</p>
          </div>
          <DialogResponsiveFooter>
            <Button className="w-full" onClick={replayGame}>
              Replay
            </Button>
          </DialogResponsiveFooter>
        </DialogResponsiveContent>
      </DialogResponsive>
      <div className="flex h-full max-w-[1200px] flex-col gap-6 p-1 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">
              {currentTeam.name}s turn:{' '}
              <span className="text-zinc-500">{game.currentPlayer?.name}</span>
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={undoTurn}
              disabled={!canUndo}
            >
              <Icon name="Undo" className="h-6 w-6" />
            </Button>
            <Button
              onClick={redoTurn}
              variant="ghost"
              size="icon"
              disabled={!canRedo}
            >
              <Icon name="Redo" className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between space-y-4 sm:block">
          <ScoresTable game={game} />
          <PlayControls
            game={game}
            onThrowDart={throwDart}
            onFinishTurn={finishTurn}
            onUndoThrow={undoThrow}
          />
        </div>
      </div>
    </>
  );
};
