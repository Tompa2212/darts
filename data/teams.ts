'use server';

import db from '@/db/drizzle';
import { players, teams, users } from '@/db/schema';
import { getUser } from '@/lib/auth';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

export const getUserTeams = async () => {
  noStore();
  const user = await getUser();

  if (!user) {
    return [];
  }

  const newQuery = await db
    .select({
      ...getTableColumns(teams),
      players: sql`json_agg(${players})`,
      playedGames: sql`1`
    })
    .from(teams)
    .innerJoin(players, eq(teams.id, players.teamId))
    .leftJoin(users, eq(players.userId, users.id))
    .groupBy(teams.id);

  console.log(JSON.stringify(newQuery, null, 2));

  return await db.query.teams.findMany({
    where: (teams, { eq, and }) =>
      and(eq(teams.userId, user.id), eq(teams.status, 'active')),
    with: {
      gameTeams: {},
      players: {
        extras: {
          id: sql<string>`${players.userId}`.as('id')
        },
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
    },
    extras: {
      playedGames: sql<number>`json_array_length("teams_gameTeams"."data")`.as(
        'played_games'
      )
    }
  });
};
