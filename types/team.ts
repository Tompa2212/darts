import { game_teams, teams } from '../db/schema';
import { Player, UserPlayer } from './player';

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamWithPlayers = Team & { players: Array<Player | UserPlayer> };

export type NewGameTeam = typeof game_teams.$inferInsert;

export type UserTeams = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  players: {
    name: string;
    userId: string | null;
    teamId: string;
    id: string;
    user: {
      id: string;
      name: string | null;
      username: string;
    } | null;
  }[];
};
