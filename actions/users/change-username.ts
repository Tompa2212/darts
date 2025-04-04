'use server';
import db from '@/db/drizzle';
import { users } from '@/db/test.schema';
import { getUser } from '@/lib/auth';
import { eq } from 'drizzle-orm/sql';

import * as z from 'zod';

const changeUsernameSchema = z.object({
  userId: z.string(),
  username: z
    .string()
    .min(3, { message: 'Min username length is 3 characters' })
    .max(64, { message: 'Max username length is 64 characters' })
});

export async function changeUsername(_prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = changeUsernameSchema.safeParse(data);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten();
    return { details: errors.fieldErrors };
  }

  const { userId, username: newUsername } = validatedFields.data;

  const loggedInUser = await getUser();
  if (!loggedInUser) {
    return { error: 'Unauthorized' };
  }

  if (loggedInUser.id !== validatedFields.data.userId) {
    return { error: 'Unauthorized' };
  }

  const existingUser = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId)
  });

  if (!existingUser) {
    return { error: 'User not found' };
  }

  const userWithSameUsername = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.username, newUsername)
  });

  if (userWithSameUsername) {
    return { error: 'Username already taken' };
  }

  const updated = await db
    .update(users)
    .set({ username: newUsername })
    .where(eq(users.id, userId))
    .returning();

  return { success: 'Username changed', data: updated[0].username };
}
