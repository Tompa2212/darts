'use server';

import db from '@/db/drizzle';
import { players } from '@/db/schema';
import { getUser } from '@/lib/auth';
import { sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

export const getUserTeams = async () => {
  noStore();
  const user = await getUser();

  if (!user) {
    return [];
  }

  return await db.query.teams.findMany({
    where: (teams, { eq }) => eq(teams.userId, user.id),
    with: {
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
    }
  });
};
