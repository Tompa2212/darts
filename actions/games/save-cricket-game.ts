'use server';

import db, { type Transaction } from '@/db/drizzle';
import { gameParticipants, gameStatsCricketPlayer, gameStatsCricketTeam } from '@/db/test.schema';
import { getUser } from '@/lib/auth';
import type { TeamsStats } from '@/packages/cricket-game/types';
import { saveCricketGameSchema } from '@/schema/save-game.schema';
import type { NewCricketGamePlayerStats, NewCricketGameTeamStats } from '@/types/player';
import type { NewGameTeam } from '@/types/team';
import type * as z from 'zod';
import { getTeamRegisteredPlayers } from './utils';
import { createCricketGame } from '@/use-cases/game/create-game';

function getPlayerStats(stats: TeamsStats, playerName: string) {
  const playerStats = stats.players[playerName] ?? {
    thrownDarts: [],
    singles: 0,
    doubles: 0,
    triples: 0,
    misses: 0,
    totalMarks: 0,
    marksPerRound: 0,
    marksPerDart: 0,
    playedTurns: 0
  };

  return playerStats;
}

async function insertGameTeams(tx: Transaction, data: NewGameTeam[]) {
  return tx.insert(gameParticipants).values(data);
}

async function insertGamePlayerStats(tx: Transaction, data: NewCricketGamePlayerStats[]) {
  if (!data.length) {
    return;
  }

  return tx.insert(gameStatsCricketPlayer).values(data);
}

async function insertGameTeamStats(tx: Transaction, data: NewCricketGameTeamStats[]) {
  return tx.insert(gameStatsCricketTeam).values(data);
}

export type InsertCricketGameData = z.infer<typeof saveCricketGameSchema>;

export default async function saveCricketGame(newGame: InsertCricketGameData) {
  const user = await getUser();

  if (!user) {
    return {
      error: 'Unauthorized'
    };
  }
  const validatedData = saveCricketGameSchema.safeParse(newGame);

  if (!validatedData.success) {
    return {
      error: 'Invalid data',
      details: validatedData.error.flatten().fieldErrors
    };
  }

  const { winner, maxRounds, currentRound, numbers, ...gameData } = validatedData.data;

  return await db.transaction(async (tx) => {
    try {
      const { game: insertedGame } = await createCricketGame(
        {
          creatorUserId: user.id,
          winningTeamId: winner?.id,
          maxRounds,
          playedRounds: currentRound,
          numbers,
          gameMode: 'cricket'
        },
        tx
      );

      if (!insertedGame) {
        throw new Error('Game not saved');
      }

      await insertGameTeams(
        tx,
        gameData.teams.map((team, idx) => {
          return {
            teamId: team.id,
            gameId: insertedGame.id,
            playOrder: idx + 1
          };
        })
      );

      await insertGameTeamStats(
        tx,
        gameData.teams.map((team) => {
          return {
            teamId: team.id,
            gameId: insertedGame.id,
            score: team.stats.totalPoints,
            pointsPerRound: team.stats.pointsPerRound,
            marksPerRound: team.stats.marksPerRound,
            totalMarks: team.stats.totalMarks
          };
        })
      );

      const registeredPlayers = getTeamRegisteredPlayers(gameData.teams);
      await insertGamePlayerStats(
        tx,
        registeredPlayers.map((player) => {
          const team = gameData.teams.find((t) => t.players.find((p) => p.id === player.id));
          if (!team) {
            throw new Error('Team not found');
          }
          const stats = getPlayerStats(team.stats, player.name);

          return {
            gameId: insertedGame.id,
            teamId: team.id,
            teamMemberId: player.id,
            ...stats
          };
        })
      );

      return { succes: 'Game saved', data: insertedGame.id };
    } catch (error) {
      console.log(error);
      tx.rollback();
      return { error: 'Cannot save game' };
    }
  });
}
