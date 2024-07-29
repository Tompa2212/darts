import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { ThrownNumber } from '@/packages/cricket-game/types';
import { ThrowDartButton } from './throw-dart-button';
import { cn } from '@/lib/utils';
import { CricketGameType } from '@/packages/cricket-game';

const MULTIPLIERS = {
  single: 1,
  double: 2,
  triple: 3
} as const;

type MultiplierValue = (typeof MULTIPLIERS)[keyof typeof MULTIPLIERS];

type PlayControlsProps = {
  game: CricketGameType;
  onThrowDart: (dart: ThrownNumber) => void;
  onFinishTurn: () => void;
  onUndoThrow: () => void;
};

const PlayControls = ({
  game,
  onThrowDart,
  onFinishTurn,
  onUndoThrow
}: PlayControlsProps) => {
  const [multiplier, setMultiplier] = useState<MultiplierValue>(
    MULTIPLIERS.single
  );

  const handleThrowDart = (number: number) => {
    onThrowDart({ number, multiplier });
    setMultiplier(MULTIPLIERS.single);
  };

  const onMultiplierToggle = (newMultiplier: MultiplierValue) => {
    setMultiplier((curr) => {
      if (curr === newMultiplier) {
        return MULTIPLIERS.single;
      }

      return newMultiplier;
    });
  };

  const isMultiplierDisabled = game.thrownDarts.length === 3;

  return (
    <div>
      <div className="flex gap-1 sm:gap-3 mb-2">
        <Button
          className="flex-1 sm:flex-initial min-w-[150px] h-10"
          size="lg"
          variant={multiplier === MULTIPLIERS.double ? 'success' : 'outline'}
          onClick={() => onMultiplierToggle(MULTIPLIERS.double)}
          disabled={isMultiplierDisabled}
        >
          Double
        </Button>
        <Button
          className="flex-1 sm:flex-initial min-w-[150px] h-10"
          size="lg"
          variant={
            multiplier === MULTIPLIERS.triple ? 'destructive' : 'outline'
          }
          onClick={() => onMultiplierToggle(MULTIPLIERS.triple)}
          disabled={isMultiplierDisabled}
        >
          Triple
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:gap-3">
        {game.numbers.map((num, idx, arr) => (
          <ThrowDartButton
            key={num}
            number={num}
            onThrowDart={handleThrowDart}
            game={game}
            multiplier={multiplier}
            className={cn(
              arr.length - 1 === idx &&
                'col-start-2 col-end-3 row-start-3 row-end-4'
            )}
          />
        ))}
        <Button
          size="lg"
          className="h-12"
          variant="outline"
          disabled={game.thrownDarts.length === 0}
          onClick={onUndoThrow}
          aria-label="Undo last throw"
        >
          <Icon name="Delete" className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          className="h-12"
          size="lg"
          onClick={onFinishTurn}
        >
          Enter
        </Button>
      </div>
    </div>
  );
};

export default PlayControls;
