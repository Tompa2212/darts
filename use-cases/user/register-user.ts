import db from '@/db/drizzle';
import { users } from '@/db/schema';
import { NewUser } from '@/types/user';
import crypto from 'node:crypto';

type RegisterUserParams = Omit<NewUser, 'username'> & {
  username?: string;
};

function createRandomUsername(name: string | null | undefined, email: string) {
  let username = name ? name : email.split('@')[0];

  username = username
    .normalize('NFKD')
    .replace(/[^\w]/g, '')
    .toLocaleLowerCase();

  return `${username}#${crypto.randomBytes(4).toString('hex')}`;
}

export async function registerUser(data: RegisterUserParams) {
  let username = data.username;

  if (!username) {
    username = createRandomUsername(data.name, data.email);
  }

  const user = await db
    .insert(users)
    .values({ ...data, username })
    .returning();

  return user[0];
}
