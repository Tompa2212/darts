'use server';

import db from '@/db/drizzle';
import { players } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';

export const getUserTeams = async (userId: string | null | undefined) => {
  noStore();

  if (!userId) {
    return [];
  }

  return await db.query.teams.findMany({
    where: (teams, { eq }) => eq(teams.userId, userId),
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
