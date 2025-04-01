'use server';

import db from '@/db/drizzle';
import { cricketGame, cricketGameTeam, teams } from '@/db/schema';
import { getUser } from '@/lib/auth';
import { and, eq, getTableColumns, sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

export const getUserTeams = async () => {
  noStore();
  const user = await getUser();

  if (!user) {
    return [];
  }

  // Use a single query with optimized subqueries
  const userTeams = await db.query.teams.findMany({
    where: (teams, { eq, and }) => and(eq(teams.userId, user.id), eq(teams.status, 'active')),
    with: {
      players: {
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

  const gameStats = await db.execute(sql`
    SELECT 
      t.id as team_id,
      (
        SELECT COUNT(*) 
        FROM (
          SELECT game_id FROM ${cricketGameTeam} WHERE ${cricketGameTeam.teamId} = t.id
          UNION ALL
          SELECT game_id FROM "zero_one_game_player_stats" WHERE "zero_one_game_player_stats"."team_id" = t.id
        ) AS combined_games
      ) as played_games,
      (
        SELECT COUNT(*) 
        FROM ${cricketGame}
        WHERE ${cricketGame.winner} = t.id
      ) as won_games
    FROM ${teams} t
    WHERE t.id IN (${sql.join(teamIds, sql.raw(','))})
  `);

  // Map the stats to each team
  return userTeams.map((team) => {
    const stats = gameStats.rows.find((stat) => stat.team_id === team.id) || {
      played_games: 0,
      won_games: 0
    };
    return {
      ...team,
      playedGames: Number(stats.played_games),
      wonGames: Number(stats.won_games)
    };
  });
};
