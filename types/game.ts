import { games, gamesCricket, gamesX01 } from '@/db/test.schema';

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export type NewCricketGame = NewGame &
  Omit<typeof gamesCricket.$inferInsert, 'gameId'> & {
    gameMode: 'cricket';
  };

export type NewZeroOneGame = NewGame &
  Omit<typeof gamesX01.$inferInsert, 'gameId'> & {
    gameMode: 'x01';
  };
