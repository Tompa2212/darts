'use server';

import db from '@/db/drizzle';
import {
  gameParticipants,
  games,
  gamesCricket,
  gameStatsCricketTeam,
  gameStatsX01Team,
  gamesX01,
  teams
} from '@/db/test.schema';
import { getUser } from '@/lib/auth';
import { eq, inArray, sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

async function getTeamsGameStats(teamIds: string[]) {
  const stats = await db
    .select({
      teamId: teams.id,
      teamName: teams.name,
      playedGames: sql<number>`COUNT(${games.id})::int`.as('played_games'),
      wonGames:
        sql<number>`SUM(CASE WHEN ${games.winningTeamId} = ${teams.id} THEN 1 ELSE 0 END)::int`.as(
          'won_games'
        ),
      playedGamesCricket: sql<number>`COUNT(CASE WHEN ${games.gameMode} = 'cricket' THEN 1 ELSE NULL END)::int`,
      wonGamesCricket: sql<number>`SUM(CASE WHEN ${games.winningTeamId} = ${teams.id} AND ${games.gameMode} = 'cricket' THEN 1 ELSE 0 END)::int`,
      playedGamesX01: sql<number>`COUNT(CASE WHEN ${games.gameMode} = 'x01' THEN 1 ELSE NULL END)::int`,
      wonGamesX01: sql<number>`SUM(CASE WHEN ${games.winningTeamId} = ${teams.id} AND ${games.gameMode} = 'x01' THEN 1 ELSE 0 END)::int`
    })
    .from(teams)
    .innerJoin(gameParticipants, eq(teams.id, gameParticipants.teamId))
    .innerJoin(games, eq(gameParticipants.gameId, games.id))
    .where(inArray(teams.id, teamIds))
    .groupBy(teams.id, teams.name);

  return stats;
}

export const getUserTeams = async () => {
  noStore();
  const user = await getUser();

  if (!user) {
    return [];
  }

  // Use a single query with optimized subqueries
  const userTeams = await db.query.teams.findMany({
    where: (teams, { eq, and }) => and(eq(teams.ownerUserId, user.id), eq(teams.status, 'active')),
    with: {
      members: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      }
    }
  });

  const teamIds = userTeams.map((team) => team.id);

  if (teamIds.length === 0) {
    return [];
  }

  const gameStats = await getTeamsGameStats(teamIds);

  // Map the stats to each team
  return userTeams.map((team) => {
    const stats = gameStats.find((stat) => stat.teamId === team.id) || {
      playedGames: 0,
      wonGames: 0,
      playedGamesCricket: 0,
      wonGamesCricket: 0,
      playedGamesX01: 0,
      wonGamesX01: 0
    };

    return {
      ...team,
      ...stats
    };
  });
};

export const getTeamById = async (id: string) => {
  noStore();

  const team = await db.query.teams.findFirst({
    where: (teams, { eq }) => eq(teams.id, id),
    with: {
      statsCricketTeam: true,
      members: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              username: true
            }
          }
        }
      }
    }
  });

  if (!team) {
    return null;
  }

  const gameStats = await getTeamsGameStats([team.id]);

  return {
    ...team,
    ...gameStats[0]
  };
};

export const getTeamCricketStats = async (teamId: string) => {
  const stats = await db
    .select({
      teamId: teams.id,
      teamName: teams.name,
      playedGames: sql<number>`COUNT(${games.id})::int`,
      wonGames: sql<number>`SUM(CASE WHEN ${games.winningTeamId} = ${teams.id} THEN 1 ELSE 0 END)::int`,
      winRate: sql<number>`ROUND(CAST(CASE WHEN COUNT(${games.id}) = 0 THEN 0 ELSE SUM(CASE WHEN ${games.winningTeamId} = ${teams.id} THEN 1 ELSE 0 END)::float / COUNT(${games.id}) END AS NUMERIC), 2)::double precision`,
      averagePointsPerRound: sql<number>`ROUND(CAST(AVG(${gameStatsCricketTeam.pointsPerRound}) AS NUMERIC), 2)::double precision`,
      averageScore: sql<number>`ROUND(CAST(AVG(${gameStatsCricketTeam.score}) AS NUMERIC), 2)::double precision`
    })
    .from(teams)
    .innerJoin(gameParticipants, eq(teams.id, gameParticipants.teamId))
    .innerJoin(games, eq(gameParticipants.gameId, games.id))
    .innerJoin(gamesCricket, eq(games.id, gamesCricket.gameId))
    .innerJoin(gameStatsCricketTeam, eq(teams.id, gameStatsCricketTeam.teamId))
    .where(eq(teams.id, teamId))
    .groupBy(teams.id, teams.name);

  return (
    stats[0] || {
      playedGames: 0,
      wonGames: 0,
      winRate: 0,
      averagePointsPerRound: 0,
      averageScore: 0
    }
  );
};

export const getTeamZeroOneStats = async (teamId: string) => {
  const stats = await db
    .select({
      teamId: teams.id,
      teamName: teams.name,
      playedGames: sql<number>`COUNT(${games.id})::int`,
      wonGames: sql<number>`SUM(CASE WHEN ${games.winningTeamId} = ${teams.id} THEN 1 ELSE 0 END)::int`,
      averageScorePerTurn: sql<number>`ROUND(CAST(AVG(${gameStatsX01Team.averageScorePerTurn}) AS NUMERIC), 2)::double precision`,
      averageCheckoutPercentage: sql<number>`ROUND(CAST(AVG(${gameStatsX01Team.checkoutPercentage}) AS NUMERIC), 2)::double precision`,
      averageScore: sql<number>`ROUND(CAST(AVG(${gameStatsX01Team.totalScore}) AS NUMERIC), 2)::double precision`,
      averageTurns: sql<number>`ROUND(CAST(AVG(${gameStatsX01Team.turnsTaken}) AS NUMERIC), 2)::double precision`,
      winRate: sql<number>`ROUND(CAST(CASE WHEN COUNT(${games.id}) = 0 THEN 0 ELSE SUM(CASE WHEN ${games.winningTeamId} = ${teams.id} THEN 1 ELSE 0 END)::float / COUNT(${games.id}) END AS NUMERIC), 2)::double precision`
    })
    .from(teams)
    .innerJoin(gameParticipants, eq(teams.id, gameParticipants.teamId))
    .innerJoin(games, eq(gameParticipants.gameId, games.id))
    .innerJoin(gamesX01, eq(games.id, gamesX01.gameId))
    .innerJoin(gameStatsX01Team, eq(teams.id, gameStatsX01Team.teamId))
    .where(eq(teams.id, teamId))
    .groupBy(teams.id, teams.name);

  return (
    stats[0] || {
      playedGames: 0,
      wonGames: 0,
      winRate: 0,
      averageScorePerTurn: 0,
      averageCheckoutPercentage: 0,
      averageScore: 0,
      averageTurns: 0
    }
  );
};
