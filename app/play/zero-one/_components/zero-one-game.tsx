import { ZeroOneGameInit } from '@/types/client/zero-one';
import React from 'react';
import { useZeroOneGame } from '../use-zero-one-game';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PlayControls } from './play-controls';

type ZeroOneGameProps = ZeroOneGameInit;

export default function ZeroOneGame(props: ZeroOneGameProps) {
  const {
    game,
    currentTeam,
    canRedo,
    canUndo,
    undoTurn,
    redoTurn,
    enterScore
  } = useZeroOneGame(props);

  return (
    <div className="flex h-full max-w-[1200px] flex-col gap-6 p-1 sm:py-4 sm:px-2 lg:px-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="max-w-[290px] xs:max-w-full text-lg text-overflow-ellipsis">
            Playing: <span className="font-semibold">{currentTeam.name}</span>,{' '}
            <span className="font-semibold text-zinc-500">
              {game.currentPlayer?.name}
            </span>
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undoTurn}
            disabled={!canUndo}
          >
            <Icon name="Undo" className="w-6 h-6" />
          </Button>
          <Button
            onClick={redoTurn}
            variant="ghost"
            size="icon"
            disabled={!canRedo}
          >
            <Icon name="Redo" className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col justify-between flex-1 space-y-4 lg:justify-normal lg:space-y-8 justify-self-end">
        <div></div>
        <PlayControls onEnterScore={enterScore} game={game} />
        {/* {JSON.stringify(game, null, 2)} */}
      </div>
    </div>
  );
}
