'use server';

import db from '@/db/drizzle';
import { gameParticipants, games, teams } from '@/db/test.schema';
import { getUser } from '@/lib/auth';
import { sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

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

  const gameStats = await db.execute(sql`
    SELECT 
      t.id as team_id,
      (
        SELECT COUNT(*) 
        FROM (
          SELECT game_id FROM ${gameParticipants} WHERE ${gameParticipants.teamId} = t.id
        ) AS combined_games
      ) as played_games,
      (
        SELECT COUNT(*) 
        FROM ${games}
        WHERE ${games.winningTeamId} = t.id
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
