'use client';

import { gameSaver } from '@/lib/games-saver/game-saver';
import { ZeroOneGame } from '@/packages/zero-one';
import { ZeroOneGameInit } from '@/types/client/zero-one';
import { useCallback, useRef, useState } from 'react';

type Action =
  | { type: 'ENTER_SCORE'; payload: number }
  | { type: 'UNDO_TURN' }
  | { type: 'REDO_TURN' }
  | { type: 'REPLAY_GAME' };

export const useZeroOneGame = (params: ZeroOneGameInit) => {
  const zeroOneGame = useRef(new ZeroOneGame(params));
  const [game, setGame] = useState(zeroOneGame.current.game);

  const { removeGame, saveGame } = gameSaver;

  const dispatcher = useCallback(
    (action: Action) => {
      const updateGame = () => {
        setGame(zeroOneGame.current.game);

        const { isFinished, winner } = zeroOneGame.current.game;
        if (isFinished && winner) {
          removeGame(zeroOneGame.current.game.id);
        } else {
          saveGame({ type: '01', game: zeroOneGame.current.game });
        }
      };

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
        case 'REPLAY_GAME':
          ref.replayGame();
      }

      updateGame();

      return returnValue;
    },
    [saveGame, removeGame]
  );

  const { canUndo, canRedo, currentTeam, teamsOutshotCombinations } =
    zeroOneGame.current;

  const undoTurn = () => dispatcher({ type: 'UNDO_TURN' });
  const redoTurn = () => dispatcher({ type: 'REDO_TURN' });
  const enterScore = (score: number) =>
    dispatcher({ type: 'ENTER_SCORE', payload: score });
  const replayGame = () => dispatcher({ type: 'REPLAY_GAME' });

  return {
    game,
    canUndo,
    canRedo,
    currentTeam,
    isFinished: game.isFinished,
    teamsOutshotCombinations,
    undoTurn,
    redoTurn,
    enterScore,
    replayGame
  };
};
