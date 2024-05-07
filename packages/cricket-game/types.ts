export type BasePlayer = {
  id?: string;
  name: string;
};

export type Team = {
  name: string;
  players: BasePlayer[];
};

type TeamWithScore = Team & {
  hitCount: {
    [key: string]: number;
  };
  points: number;
};

export type Game = {
  teams: TeamWithScore[];
  numbers: number[];
  currentPlayer: BasePlayer | null;
  currentTeam: number;
  currentRound: number;
  isFinished: boolean;
  isRandomNumbers: boolean;
  maxRounds: number;
  winner: Team | null;
  disabledNumbers: Set<number>;
  thrownDarts: number[];
};
