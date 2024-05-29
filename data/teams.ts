'use server';

import db from '@/db/drizzle';
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
        with: {
          user: {
            columns: {
              emailVerified: false
            }
          }
        }
      }
    }
  });
};
