import { players } from '@/db/schema';

export type Player = typeof players.$inferSelect;
export type NewPlayer = Omit<typeof players.$inferInsert, 'teamId'>;

export type UserPlayer = Player & {
  user: { id: string; username: string; email: string };
};
