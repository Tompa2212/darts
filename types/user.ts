import { users } from '../db/test.schema';

export type User = Omit<typeof users.$inferSelect, 'emailVerified'>;
export type NewUser = typeof users.$inferInsert;
