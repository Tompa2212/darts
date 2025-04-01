import { ZeroOneGameInit } from '@/types/client/zero-one';
import React from 'react';
import { useZeroOneGame } from '../use-zero-one-game';
import { Button } from '@/components/ui/button';
import { PlayControls } from './play-controls';
import ScoresTable from './scores-table';
import FinishedGameDialog from './finished-dialog';
import { Badge } from '@/components/ui/badge';
import { RedoIcon, UndoIcon } from 'lucide-react';

const multiplierLabelMap = {
  1: '',
  2: 'D',
  3: 'T'
};

type ZeroOneGameProps = ZeroOneGameInit;

export function ZeroOneGame(props: ZeroOneGameProps) {
  const {
    game,
    currentTeam,
    canRedo,
    canUndo,
    teamsOutshotCombinations,
    undoTurn,
    redoTurn,
    enterScore,
    replayGame
  } = useZeroOneGame(props);

  const currentTeamOutshotCombinations = teamsOutshotCombinations[currentTeam.id];

  return (
    <>
      <FinishedGameDialog game={game} onReplayGame={replayGame} />
      <div className="flex h-full max-w-[1200px] flex-col gap-6 p-1 sm:px-2 sm:py-4 lg:px-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="xs:max-w-full text-overflow-ellipsis max-w-[290px] text-lg">
              Playing: <span className="font-semibold">{currentTeam.name}</span>,{' '}
              <span className="font-semibold text-zinc-500">{game.currentPlayer?.name}</span>
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={undoTurn} disabled={!canUndo}>
              <UndoIcon name="Undo" className="size-6" />
            </Button>
            <Button onClick={redoTurn} variant="ghost" size="icon" disabled={!canRedo}>
              <RedoIcon name="Redo" className="size-6" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-4 justify-self-end lg:justify-normal lg:space-y-8">
          <ScoresTable game={game} />
          <div className="mx-auto my-[10%] space-y-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {currentTeamOutshotCombinations.combinations.map((combination, index) => (
                  <Badge className="text-base" variant="secondary" key={index}>
                    {combination
                      .map(
                        (dart) =>
                          `${
                            multiplierLabelMap[dart.multiplier as keyof typeof multiplierLabelMap]
                          }${dart.value}`
                      )
                      .join(' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <PlayControls onEnterScore={enterScore} game={game} />
        </div>
      </div>
    </>
  );
}
