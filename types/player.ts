import { players, cricket_game_player_stats } from '@/db/schema';

export type Player = typeof players.$inferSelect;
export type NewPlayer = Omit<typeof players.$inferInsert, 'teamId'>;

export type UserPlayer = Player & {
  id: string | null;
  user: { id: string; username: string; email: string };
};

export type NewGamePlayerStats = typeof cricket_game_player_stats.$inferInsert;
