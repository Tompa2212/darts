import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getUserById } from './data/user';
import db from './db/drizzle';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      // const existingAccount = await getAccountByUserId(existingUser.id);

      // token.isOAuth = !!existingAccount;
      token.id = existingUser.id;
      token.email = existingUser.email;
      token.username = existingUser.username;
      token.name = existingUser.name;
      // token.role = existingUser.role;
      // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name || null;
        session.user.email = token.email!;
        session.user.username = token.username!;
        // session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    }
  },
  ...authConfig
});
