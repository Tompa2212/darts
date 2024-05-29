import db from '@/db/drizzle';
import { users } from '@/db/schema';
import { NewUser } from '@/types/user';

export async function registerUser(data: NewUser) {
  const user = await db.insert(users).values(data).returning();

  return user[0];
}
