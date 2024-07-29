'use client';

import { ZeroOneGame } from '@/packages/zero-one';
import { ZeroOneGameInit } from '@/types/client/zero-one';
import { useCallback, useRef, useState } from 'react';

type Action =
  | { type: 'ENTER_SCORE'; payload: number }
  | { type: 'UNDO_TURN' }
  | { type: 'REDO_TURN' };

export const useZeroOneGame = (params: ZeroOneGameInit) => {
  const zeroOneGame = useRef(new ZeroOneGame(params));
  const [game, setGame] = useState(zeroOneGame.current.game);

  const dispatcher = useCallback((action: Action) => {
    const ref = zeroOneGame.current;
    let returnValue;

    switch (action.type) {
      case 'ENTER_SCORE':
        returnValue = ref.enterScore(action.payload);
        break;
      case 'UNDO_TURN':
        ref.undoTurn();
        break;
      case 'REDO_TURN':
        ref.redoTurn();
        break;
    }

    setGame(ref.game);

    return returnValue;
  }, []);

  const { canUndo, canRedo, currentTeam } = zeroOneGame.current;

  const undoTurn = () => dispatcher({ type: 'UNDO_TURN' });
  const redoTurn = () => dispatcher({ type: 'REDO_TURN' });
  const enterScore = (score: number) =>
    dispatcher({ type: 'ENTER_SCORE', payload: score });

  return {
    game,
    canUndo,
    canRedo,
    currentTeam,
    isFinished: game.isFinished,
    undoTurn,
    redoTurn,
    enterScore
  };
};
