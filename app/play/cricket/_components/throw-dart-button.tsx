import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CricketGameType } from '@/packages/cricket-game';
import React from 'react';

type ThrowDartButtonProps = {
  number: number;
  game: CricketGameType;
  multiplier: number;
  className?: string;
  onThrowDart: (num: number) => void;
};

export const ThrowDartButton = ({
  number,
  game,
  multiplier,
  className,
  onThrowDart
}: ThrowDartButtonProps) => {
  const disabled =
    game.closedNumbers.has(number) ||
    game.thrownDarts.length === 3 ||
    (multiplier === 3 && number === 25);

  const label = number === 25 ? 'Bull' : number;

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn(
        className,
        'hover:bg-background hover:text-primary active:bg-accent active:text-accent-foreground h-12 duration-75'
      )}
      onClick={() => onThrowDart(number)}
      disabled={disabled}
      aria-label={`Throw ${number}`}
    >
      {label}
    </Button>
  );
};
