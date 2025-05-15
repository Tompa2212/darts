import { Button, type ButtonProps } from '@/components/ui/button';
import React, { useState } from 'react';
import type { ThrownNumber } from '@/packages/cricket-game/types';
import { ThrowDartButton } from './throw-dart-button';
import { cn } from '@/lib/utils';
import type { CricketGameType } from '@/packages/cricket-game';
import { DeleteIcon } from 'lucide-react';

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

const PlayControls = ({ game, onThrowDart, onFinishTurn, onUndoThrow }: PlayControlsProps) => {
  const [multiplier, setMultiplier] = useState<MultiplierValue>(MULTIPLIERS.single);

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
      <div className="mb-2 flex gap-1 sm:gap-3">
        <Button
          className="h-10 min-w-[150px] flex-1 sm:flex-initial"
          size="lg"
          variant={multiplier === MULTIPLIERS.double ? 'success' : 'outline'}
          onClick={() => onMultiplierToggle(MULTIPLIERS.double)}
          disabled={isMultiplierDisabled}
        >
          Double
        </Button>
        <Button
          className="h-10 min-w-[150px] flex-1 sm:flex-initial"
          size="lg"
          variant={multiplier === MULTIPLIERS.triple ? 'destructive' : 'outline'}
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
            className={cn(arr.length - 1 === idx && 'col-start-2 col-end-3 row-start-3 row-end-4')}
          />
        ))}
        <ControlBtn
          disabled={game.thrownDarts.length === 0}
          onClick={onUndoThrow}
          aria-label="Undo last throw"
        >
          <DeleteIcon className="size-6" />
        </ControlBtn>
        <ControlBtn onClick={onFinishTurn}>Enter</ControlBtn>
      </div>
    </div>
  );
};

export default PlayControls;

function ControlBtn({ children, onClick, className, ...rest }: ButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        'hover:bg-background hover:text-primary active:bg-accent active:text-accent-foreground h-12 duration-75',
        className
      )}
      size="lg"
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
}
