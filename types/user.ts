import { users } from '../db/schema';

export type User = Omit<
  typeof users.$inferSelect,
  'password' | 'emailVerified'
>;
export type NewUser = typeof users.$inferInsert;
