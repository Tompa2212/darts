'use client';

import React from 'react';
import { useCricketGame } from '../use-cricket-game';
import { ScoresTable } from './scores-table';
import PlayControls from './play-controls';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { CricketGameInit } from '@/types/client/cricket';
import FinishedGameDialog from './finished-game-dialog';

type CricketGameProps = CricketGameInit;

export const CricketGame = (props: CricketGameProps) => {
  const { game, canRedo, canUndo, currentTeam, dispatcher } =
    useCricketGame(props);

  return (
    <>
      <FinishedGameDialog
        game={game}
        onReplayGame={() => dispatcher({ type: 'REPLAY_GAME' })}
      />
      <div className="flex h-full max-w-[1200px] flex-col gap-6 p-1 sm:py-4 sm:px-2 lg:px-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="max-w-[290px] xs:max-w-full text-lg text-overflow-ellipsis">
              Playing: <span className="font-semibold">{currentTeam.name}</span>
              ,{' '}
              <span className="text-zinc-500 font-semibold">
                {game.currentPlayer?.name}
              </span>
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatcher({ type: 'UNDO_TURN' })}
              disabled={!canUndo}
            >
              <Icon name="Undo" className="h-6 w-6" />
            </Button>
            <Button
              onClick={() => dispatcher({ type: 'REDO_TURN' })}
              variant="ghost"
              size="icon"
              disabled={!canRedo}
            >
              <Icon name="Redo" className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between lg:justify-normal space-y-4 lg:space-y-8">
          <ScoresTable game={game} />
          <div>
            <div className="flex items-center gap-4 lg:mb-4">
              <div className="mb-4 border-b rounded-md w-fit p-2">
                <p className="text-sm font-semibold">
                  Thrown Darts: <span>{game.thrownDarts.length}</span>
                </p>
              </div>
              <div className="mb-4 border-b rounded-md w-fit p-2">
                <p className="text-sm font-semibold">
                  Points: <span>{game.currentTurnPoints}</span>
                </p>
              </div>
            </div>
            <PlayControls
              game={game}
              onThrowDart={(thrownDart) => {
                dispatcher({ type: 'THROW_DART', payload: thrownDart });
              }}
              onFinishTurn={() => {
                dispatcher({ type: 'FINISH_TURN' });
              }}
              onUndoThrow={() => dispatcher({ type: 'UNDO_THROW' })}
            />
          </div>
        </div>
      </div>
    </>
  );
};
