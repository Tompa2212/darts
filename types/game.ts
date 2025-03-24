import { game } from '@/db/schema';

export type Game = {
  id: string;
  creator: string;
  winner: string;
  createdAt: string;
};

export type NewGame = typeof game.$inferInsert;
