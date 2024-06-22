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
  hitCount: {
    [key: string]: number;
  };
  points: number;
  stats?: TeamsStats;
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
  currentPlayer: BasePlayer;
  currentTeam: TeamWithScore;
  currentRound: number;
  currentTurnPoints: number;
  isFinished: boolean;
  isRandomNumbers: boolean;
  maxRounds: number;
  winner: Team | null;
  closedNumbers: Set<number>;
  thrownDarts: ThrownDart[];
};

export type TeamsStats = {
  playedTurns: number;
  pointsPerRound: number;
  totalPoints: number;
  players: PlayerDartsStats;
};

export type PlayerDartsStats = {
  [playerName: string]: {
    thrownDarts: ThrownNumber[];
    doubles: number;
    triples: number;
    singles: number;
    misses: number;
    playedTurns: number;
    totalMarks: number;
    marksPerRound: number;
    marksPerDart: number;
  };
};
