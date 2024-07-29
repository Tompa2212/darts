import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { ZeroOneGameType } from '@/packages/zero-one';
import React from 'react';

type PlayControlsProps = {
  game: ZeroOneGameType;
  onEnterScore: (score: number) => { error: string } | void;
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
    const message = onEnterScore(+score);

    if (!message) {
      setScore('');
    } else if (message.error) {
      alert(message.error);
    }
  }

  return (
    <div>
      <Badge className="mb-4 rounded-2xl text-lg justify-center w-20 h-10">
        {score || 0}
      </Badge>
      <div className="grid grid-cols-3 gap-1 sm:flex sm:flex-wrap sm:gap-3">
        {nums.map((num, idx, arr) => (
          <Button
            key={num}
            variant="outline"
            size="lg"
            className={cn(
              arr.length - 1 === idx &&
                'col-start-2 col-end-3 row-start-4 row-end-5',
              'h-12'
            )}
            onClick={() => handleNumClick(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          size="lg"
          className="h-12"
          variant="outline"
          onClick={handleDeleteNum}
          disabled={!score}
          aria-label="Undo last throw"
        >
          <Icon name="Delete" className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          className="h-12"
          size="lg"
          onClick={handleEnterScore}
        >
          Enter
        </Button>
      </div>
    </div>
  );
}
