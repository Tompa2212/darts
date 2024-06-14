'use server';
import { revalidatePath } from 'next/cache';
import db from '@/db/drizzle';
import { teams } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getUser } from '@/lib/auth';

export async function deleteTeam(id: string) {
  try {
    const user = await getUser();

    if (!user) {
      return {
        error: 'Unauthorized'
      };
    }

    await db
      .delete(teams)
      .where(and(eq(teams.id, id), eq(teams.userId, user.id)));
  } catch (error) {
    return {
      error: 'Unable to delete team'
    };
  }
  revalidatePath('/teams');
}
