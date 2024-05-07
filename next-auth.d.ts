import NextAuth, { type DefaultSession } from 'next-auth';
import type { JWT as authJwt } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends authJwt {
    id: string;
    email: string;
    username: string;
  }
}

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  username: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
