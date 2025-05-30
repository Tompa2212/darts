import type { CricketGameType } from '@/packages/cricket-game';
import React from 'react';

type CricketGameInfoProps = {
  game: CricketGameType;
};

const multiplierLabelMap = {
  1: '',
  2: 'D',
  3: 'T'
};

const CricketGameInfo = ({ game }: CricketGameInfoProps) => {
  const thrownDartsInfo =
    game.thrownDarts
      .map((dart) => {
        return `${
          multiplierLabelMap[dart.multiplier as keyof typeof multiplierLabelMap]
        }${dart.number}`;
      })
      .join(', ') || '/';

  return (
    <div className="flex items-center gap-4 py-2 lg:mb-4">
      <div className="mb-4 grow text-center">
        <p className="text-lg font-semibold">
          Thrown Darts: <span>{thrownDartsInfo}</span>
        </p>
      </div>
      <div className="mb-4 grow text-center">
        <p className="text-lg font-semibold">
          Points: <span>{game.currentTurnPoints}</span>
        </p>
      </div>
    </div>
  );
};

export default CricketGameInfo;
