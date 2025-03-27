import { cricketGame, gameModeEnum } from '@/db/schema';

export type Game = {
  id: string;
  creator: string;
  winner: string;
  createdAt: string;
  playedRounds: number;
  maxRounds?: number | null;
  gameMode: (typeof gameModeEnum.enumValues)[number];
};

export type NewCricketGame = typeof cricketGame.$inferInsert;
