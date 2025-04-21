'use server';

import { revalidatePath } from 'next/cache';
import db from '@/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { getUser } from '@/lib/auth';
import { teams } from '@/db/test.schema';

export async function deleteTeam(formData: FormData) {
  const teamId = formData.get('teamId') as string;

  try {
    const user = await getUser();

    if (!user) {
      return;
    }

    await db
      .update(teams)
      .set({ status: 'deleted' })
      .where(and(eq(teams.id, teamId), eq(teams.ownerUserId, user.id)));
  } catch (error) {
    console.log(error);
  }
  revalidatePath('/teams');
}
