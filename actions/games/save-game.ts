'use server';
import db from '@/db/drizzle';
import { game, game_player_stats, game_teams } from '@/db/schema';
import { getUser } from '@/lib/auth';
import { TeamsStats } from '@/packages/cricket-game/statistic-generator';
import { saveCricketGameSchema } from '@/schema/save-game.schema';
import { NewGame } from '@/types/game';
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
    team: { id: string; name: string };
  }[];
}

function getTeamStats(id: string, stats: TeamsStats[]) {
  return stats.find((stat) => stat.id === id);
}

function getPlayerStats(
  teamId: string,
  playerName: string,
  stats: TeamsStats[]
) {
  const teamStats = getTeamStats(teamId, stats);
  return (teamStats?.players || {})[playerName];
}

async function insertGame(tx: PgTransaction<any, any, any>, data: NewGame) {
  return (await tx.insert(game).values(data).returning()).at(0);
}

async function insertGameTeams(
  tx: PgTransaction<any, any, any>,
  data: NewGameTeam[]
) {
  return tx.insert(game_teams).values(data).returning();
}

async function insertGamePlayerStats(
  tx: PgTransaction<any, any, any>,
  data: NewGamePlayerStats[]
) {
  if (!data.length) {
    return;
  }

  return tx.insert(game_player_stats).values(data).returning();
}

export type InsertCricketGameData = z.infer<typeof saveCricketGameSchema>;

export default async function saveGame(
  newGame: InsertCricketGameData,
  gameMode: 'cricket',
  stats: TeamsStats[]
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
            const teamStats = getTeamStats(team.id, stats);

            return {
              teamId: team.id,
              gameId: insertedGame.id,
              score: teamStats?.score || 0,
              pointsPerRound: teamStats?.pointsPerRound || 0
            };
          })
        ),
        insertGamePlayerStats(
          tx,
          registeredPlayers.map((player) => {
            const playerStats = getPlayerStats(
              player.team.id,
              player.name,
              stats
            );

            return {
              gameId: insertedGame.id,
              teamId: player.team.id,
              playerId: player.id,
              doubles: playerStats?.doubles || 0,
              triples: playerStats?.triples || 0,
              pointsPerRound: playerStats?.pointsPerTurn || 0,
              thrownDarts: playerStats?.darts || []
            };
          })
        )
      ]);

      return { succes: 'Game saved', data: insertedGame.id };
    } catch (error) {
      tx.rollback();
      return { error: 'Cannot save game' };
    }
  });
}
