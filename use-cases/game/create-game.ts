import db, { type Transaction } from '@/db/drizzle';
import { games, gamesCricket, gamesX01 } from '@/db/test.schema';
import { getUser } from '@/lib/auth';
import type { NewCricketGame, NewGame, NewZeroOneGame } from '@/types/game';

const createGame = async (game: NewGame, tx?: Transaction) => {
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const repo = tx ?? db;
  const [savedGame] = await repo.insert(games).values(game).returning();

  return savedGame;
};

export const createCricketGame = async (game: NewCricketGame, tx?: Transaction) => {
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const savedGame = await createGame(game, tx);
  const [cricketGame] = await (tx ?? db)
    .insert(gamesCricket)
    .values({
      gameId: savedGame.id,
      numbers: game.numbers
    })
    .returning();

  return { game: savedGame, cricketGame };
};

export const createX01Game = async (game: NewZeroOneGame, tx?: Transaction) => {
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const savedGame = await createGame(game, tx);
  const [x01Game] = await (tx ?? db)
    .insert(gamesX01)
    .values({
      gameId: savedGame.id,
      ...game
    })
    .returning();

  return { game: savedGame, x01Game };
};
