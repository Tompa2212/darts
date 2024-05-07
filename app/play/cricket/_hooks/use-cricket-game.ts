'use client';
import { useRef, useState } from 'react';
import { CricketGame } from '@/packages/cricket-game/game';
import { Team } from '@/packages/cricket-game';

type CricketGameParams = {
  teams: Team[];
  useRandomNums?: boolean;
  numbers?: number[];
  maxRounds?: number;
};

export const useCricketGame = ({
  teams,
  useRandomNums = false,
  numbers,
  maxRounds = Infinity
}: CricketGameParams) => {
  const cricketGame = useRef(
    new CricketGame({ teams, numbers, useRandomNums, maxRounds })
  );
  const [game, setGame] = useState(cricketGame.current.game);

  const updateGame = () => setGame(cricketGame.current.game);

  const throwDart = (num: number) => {
    cricketGame.current.throwDart(num);
    updateGame();
  };

  const finishTurn = () => {
    cricketGame.current.nextPlayer();
    updateGame();
  };

  const undoThrow = () => {
    cricketGame.current.undoThrow();
    updateGame();
  };

  const replayGame = () => {
    cricketGame.current.replayGame();
    updateGame();
  };

  const undoTurn = () => {
    cricketGame.current.undoTurn();
    updateGame();
  };

  const redoTurn = () => {
    cricketGame.current.redoTurn();
    updateGame();
  };

  const { canUndo, canRedo, currentTeam } = cricketGame.current;

  return {
    game,
    canUndo,
    canRedo,
    currentTeam,
    throwDart,
    finishTurn,
    undoThrow,
    replayGame,
    undoTurn,
    redoTurn
  };
};
