import db from './db/drizzle';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Google } from 'arctic';
import { sessions, users } from './db/test.schema';
import { Lucia } from 'lucia';
import type { User } from './types/user';
import { env } from './config';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production'
    }
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      name: attributes.name,
      username: attributes.username,
      email: attributes.email,
      image: attributes.image
    };
  }
});

export type SessionUser = Omit<User, 'auth0Id' | 'status'>;

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: SessionUser;
  }
}

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);
