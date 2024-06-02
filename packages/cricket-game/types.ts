export type BasePlayer = {
  id?: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  players: BasePlayer[];
};

type TeamWithScore = Team & {
  hitCount: {
    [key: string]: number;
  };
  points: number;
};

export type ThrownNumber = {
  number: number;
  multiplier: number;
};

export type ThrownDart = {
  number: number;
  multiplier: number;
  points: number;
  closed: boolean;
};

export type Game = {
  id: string;
  teams: TeamWithScore[];
  numbers: number[];
  currentPlayer: BasePlayer | null;
  currentTeam: number;
  currentRound: number;
  currentTurnPoints: number;
  isFinished: boolean;
  isRandomNumbers: boolean;
  maxRounds: number;
  winner: Team | null;
  closedNumbers: Set<number>;
  thrownDarts: ThrownDart[];
};
