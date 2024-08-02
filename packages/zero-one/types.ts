import { gameModes } from '.';

export type ZeroOneType = (typeof gameModes)[number];

export type BasePlayer = {
  id?: string | null;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  players: BasePlayer[];
};

export type TeamWithScore = Team & {
  points: number;
  sets: number;
  legs: number;
};

export type ZeroOneGameType = {
  id: string;
  type: ZeroOneType;
  teams: TeamWithScore[];
  currentTeam: TeamWithScore;
  currentPlayer: BasePlayer;
  currentRound: number;
  roundTurnsPlayed: number;
  winner: TeamWithScore | null;
  sets: number;
  currentSet: number;
  maxSets: number;
  legs: number;
  currentLeg: number;
  maxLegs: number;
  isFinished: boolean;
  doubleOut: boolean;
};

export type Dart = {
  value: number;
  multiplier: number;
};

export type TeamsOutshotCombinations = {
  [teamId: string]: {
    points: number;
    combinations: Dart[][];
  };
};
