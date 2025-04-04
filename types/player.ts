import { gameStatsCricketPlayer, gameStatsCricketTeam, teamMembers } from '@/db/test.schema';

export type Player = typeof teamMembers.$inferSelect;
export type NewPlayer = Omit<typeof teamMembers.$inferInsert, 'teamId'>;

export type UserPlayer = Player & {
  id: string | null;
  user: { id: string; username: string; email: string };
};
export type NewCricketGamePlayerStats = typeof gameStatsCricketPlayer.$inferInsert;
export type NewCricketGameTeamStats = typeof gameStatsCricketTeam.$inferInsert;
