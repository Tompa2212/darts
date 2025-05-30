import { Badge } from '@/components/ui/badge';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ZeroOneGameType } from '@/packages/zero-one';
import { DeleteIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

type PlayControlsProps = {
  game: ZeroOneGameType;
  onEnterScore: (score: number) => { error: string } | { message: string } | undefined;
};

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export function PlayControls({ game, onEnterScore }: PlayControlsProps) {
  const [score, setScore] = React.useState('');

  function handleNumClick(num: number) {
    setScore((prev) => Number(prev + num).toString());
  }

  function handleDeleteNum() {
    setScore((prev) => prev.slice(0, -1));
  }

  function handleEnterScore() {
    const message = onEnterScore(Number(score));
    if (!message) {
      setScore('');
    } else if ('error' in message) {
      toast.error(message.error, {
        position: 'top-center',
        description: 'Invalid score was entered. Please try again.',
        duration: 2000
      });
    }
  }

  const scoreDisplay = score !== '' ? score : game.currentTeam.score;
  const isWritingScore = score !== '';

  return (
    <div>
      <Badge
        className={cn(
          'mb-4 h-14 w-32 justify-center rounded-xl text-2xl',
          isWritingScore && 'bg-green-700'
        )}
      >
        {scoreDisplay}
      </Badge>
      <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:gap-3">
        {nums.map((num, idx, arr) => (
          <ControlBtn
            key={num}
            className={cn(arr.length - 1 === idx && 'col-start-2 col-end-3 row-start-4 row-end-5')}
            onClick={() => handleNumClick(num)}
          >
            {num}
          </ControlBtn>
        ))}
        <ControlBtn onClick={handleDeleteNum} disabled={!score} aria-label="Undo last throw">
          <DeleteIcon name="Delete" className="size-6" />
        </ControlBtn>
        <ControlBtn onClick={handleEnterScore}>Enter</ControlBtn>
      </div>
    </div>
  );
}

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
