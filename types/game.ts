import { game } from '@/db/schema';

export type NewGame = typeof game.$inferInsert;

