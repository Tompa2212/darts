'use server';
import { revalidatePath } from 'next/cache';
import db from '@/db/drizzle';
import { teams } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteTeam(id: string) {
  try {
    await db.delete(teams).where(eq(teams.id, id));
  } catch (error) {
    console.error('Error deleting team', error);
    return {
      error: 'Unable to delete team'
    };
  }
  revalidatePath('/teams');
}
