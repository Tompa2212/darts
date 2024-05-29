'use client';

import { useCallback, useRef, useState } from 'react';
import { CricketGame } from '@/packages/cricket-game/game';
import { ThrownNumber } from '@/packages/cricket-game/types';
import { CricketGameInit } from '@/types/client/cricket';
import { cricketGameSaver } from '@/lib/games-saver/cricket-game-saver';

type Action =
  | {
      type: 'THROW_DART';
      payload: ThrownNumber;
    }
  | {
      type: 'FINISH_TURN';
    }
  | {
      type: 'UNDO_THROW';
    }
  | {
      type: 'REPLAY_GAME';
    }
  | {
      type: 'UNDO_TURN';
    }
  | {
      type: 'REDO_TURN';
    };

export const useCricketGame = (params: CricketGameInit) => {
  const cricketGame = useRef(new CricketGame(params));
  const [game, setGame] = useState(cricketGame.current.game);

  const { removeGame, saveGame } = cricketGameSaver;

  const dispatcher = useCallback(
    (action: Action) => {
      const updateGame = () => {
        setGame(cricketGame.current.game);

        if (cricketGame.current.game.isFinished) {
          removeGame(cricketGame.current.game.id);
        } else {
          saveGame(cricketGame.current.game);
        }
      };

      const ref = cricketGame.current;
      switch (action.type) {
        case 'THROW_DART':
          ref.throwDart(action.payload);
          break;
        case 'FINISH_TURN':
          ref.nextPlayer();
          break;
        case 'UNDO_THROW':
          ref.undoThrow();
          break;
        case 'REPLAY_GAME':
          ref.replayGame();
          break;
        case 'UNDO_TURN':
          ref.undoTurn();
          break;
        case 'REDO_TURN':
          ref.redoTurn();
          break;
      }
      updateGame();
    },
    [removeGame, saveGame]
  );

  const { canUndo, canRedo, currentTeam } = cricketGame.current;

  return {
    game,
    canUndo,
    canRedo,
    currentTeam,
    isFinished: game.isFinished,
    dispatcher
  };
};
