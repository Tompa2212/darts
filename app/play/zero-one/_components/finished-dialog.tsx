import { Button } from '@/components/ui/button';
import {
  DialogResponsive,
  DialogResponsiveContent,
  DialogResponsiveHeader,
  DialogResponsiveFooter
} from '@/components/ui/dialog-responsive';
import type { ZeroOneGameType } from '@/packages/zero-one';
import React from 'react';

type FinishedGameDialogProps = {
  game: ZeroOneGameType;
  onReplayGame: () => void;
};

export default function FinishedGameDialog({ game, onReplayGame }: FinishedGameDialogProps) {
  const [open, setOpen] = React.useState<boolean | undefined>(undefined);

  if (!game.isFinished) {
    return null;
  }

  const isOpen = open !== undefined ? open : game.isFinished;

  return (
    <DialogResponsive open={isOpen} onOpenChange={setOpen}>
      <DialogResponsiveContent>
        <DialogResponsiveHeader>
          <h2 className="text-2xl">Game finished!</h2>
        </DialogResponsiveHeader>
        <div>
          <p className="mb-4">{game.winner?.name} won the game!</p>
        </div>
        <DialogResponsiveFooter>
          <Button className="w-full" onClick={onReplayGame}>
            Replay
          </Button>
        </DialogResponsiveFooter>
      </DialogResponsiveContent>
    </DialogResponsive>
  );
}
