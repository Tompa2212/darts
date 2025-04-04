'use server';
import { revalidatePath } from 'next/cache';
import db from '@/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { getUser } from '@/lib/auth';
import { teams } from '@/db/test.schema';

export async function deleteTeam(id: string) {
  try {
    const user = await getUser();

    if (!user) {
      return {
        error: 'Unauthorized'
      };
    }

    await db
      .update(teams)
      .set({ status: 'deleted' })
      .where(and(eq(teams.id, id), eq(teams.ownerUserId, user.id)));
  } catch (error) {
    console.log(error);
    return {
      error: 'Unable to delete team'
    };
  }
  revalidatePath('/teams');
}
