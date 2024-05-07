import { Button } from '@/components/ui/button';
import React from 'react';
import { Game } from '@/packages/cricket-game';
import { Icon } from '@/components/ui/icon';
import clsx from 'clsx';

type PlayControlsProps = {
  game: Game;
  onThrowDart: (num: number) => void;
  onFinishTurn: () => void;
  onUndoThrow: () => void;
};

const PlayControls = ({
  game,
  onThrowDart,
  onFinishTurn,
  onUndoThrow
}: PlayControlsProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:gap-3">
      {game.numbers.map((num, idx, arr) => (
        <Button
          key={num}
          variant="outline"
          size="lg"
          className={clsx(
            'h-12',
            arr.length - 1 === idx &&
              'col-start-2 col-end-3 row-start-3 row-end-4'
          )}
          onClick={() => onThrowDart(num)}
          disabled={game.disabledNumbers.has(num)}
          aria-label={`Throw ${num}`}
        >
          {num === 25 ? 'Bull' : num}
        </Button>
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
  );
};

export default PlayControls;
