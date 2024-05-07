'use server';
import { registerSchema } from '@/schema/auth.schema';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserByUsername } from '@/data/user';
import db from '@/db/drizzle';
import { users } from '@/db/schema';

export async function register(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields!'
    };
  }

  const { email, password, username } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  let existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  existingUser = await getUserByUsername(username);

  if (existingUser) {
    return { error: 'Username already in use!' };
  }

  await db.insert(users).values({
    email,
    password: hashedPassword,
    username
  });

  return { success: 'User created!' };
}
