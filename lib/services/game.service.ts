import { getUser } from '../auth';
import db from '@/db/drizzle';
import { games, gamesCricket } from '@/db/test.schema';
import { NewCricketGame, NewGame } from '@/types/game';
import { PgTransaction } from 'drizzle-orm/pg-core';

const saveGame = async (game: NewGame, tx?: PgTransaction<any, any, any>) => {
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const repo = tx ?? db;
  const [savedGame] = await repo.insert(games).values(game).returning();

  return savedGame;
};

const saveCricketGame = async (game: NewCricketGame, tx?: PgTransaction<any, any, any>) => {
  const user = await getUser();
  if (!user) {
    throw new Error('User not found');
  }

  const savedGame = await saveGame(game, tx);
  const [cricketGame] = await (tx ?? db)
    .insert(gamesCricket)
    .values({
      gameId: savedGame.id,
      numbers: game.numbers
    })
    .returning();

  return { game: savedGame, cricketGame };
};

export const gameService = {
  saveGame,
  saveCricketGame
};
