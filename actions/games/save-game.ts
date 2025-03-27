'use server';
import db from '@/db/drizzle';
import {
  cricketGame,
  cricketGamePlayerStats,
  cricketGameTeam
} from '@/db/schema';
import { getUser } from '@/lib/auth';
import { TeamWithScore } from '@/packages/cricket-game/types';
import { saveCricketGameSchema } from '@/schema/save-game.schema';
import { NewCricketGame } from '@/types/game';
import { NewGamePlayerStats } from '@/types/player';
import { NewGameTeam } from '@/types/team';
import { PgTransaction } from 'drizzle-orm/pg-core';
import * as z from 'zod';

function getRegisteredPlayers(teams: InsertCricketGameData['teams']) {
  return teams
    .map((team) =>
      team.players.map((player) => ({
        team,
        ...player
      }))
    )
    .flat()
    .filter((player) => player.id) as {
    id: string;
    name: string;
    team: TeamWithScore;
  }[];
}

function getPlayerStats(team: TeamWithScore, playerName: string) {
  const playerStats = team.stats?.players[playerName] ?? {
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

async function insertGame(
  tx: PgTransaction<any, any, any>,
  data: NewCricketGame
) {
  return (await tx.insert(cricketGame).values(data).returning()).at(0);
}

async function insertGameTeams(
  tx: PgTransaction<any, any, any>,
  data: NewGameTeam[]
) {
  return tx.insert(cricketGameTeam).values(data).returning();
}

async function insertGamePlayerStats(
  tx: PgTransaction<any, any, any>,
  data: NewGamePlayerStats[]
) {
  if (!data.length) {
    return;
  }

  return tx.insert(cricketGamePlayerStats).values(data).returning();
}

export type InsertCricketGameData = z.infer<typeof saveCricketGameSchema>;

export default async function saveGame(
  newGame: InsertCricketGameData,
  gameMode: 'cricket'
) {
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

  const { winner, maxRounds, currentRound, numbers, ...gameData } =
    validatedData.data;

  return await db.transaction(async (tx) => {
    try {
      const insertedGame = await insertGame(tx, {
        creator: user.id,
        winner: winner?.id,
        maxRounds,
        playedRounds: currentRound,
        numbers,
        gameMode
      });

      if (!insertedGame) {
        throw new Error('Game not saved');
      }

      const registeredPlayers = getRegisteredPlayers(gameData.teams);

      await Promise.all([
        insertGameTeams(
          tx,
          gameData.teams.map((team) => {
            const teamStats = team.stats;

            return {
              teamId: team.id,
              gameId: insertedGame.id,
              score: teamStats?.totalPoints || 0,
              pointsPerRound: teamStats?.pointsPerRound || 0
            };
          })
        ),
        insertGamePlayerStats(
          tx,
          registeredPlayers.map((player) => {
            const stats = getPlayerStats(player.team, player.name);

            return {
              gameId: insertedGame.id,
              teamId: player.team.id,
              playerId: player.id,
              ...stats
            };
          })
        )
      ]);

      return { succes: 'Game saved', data: insertedGame.id };
    } catch (error) {
      console.log(error);
      tx.rollback();
      return { error: 'Cannot save game' };
    }
  });
}
