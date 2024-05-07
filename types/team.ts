import { teams } from '../db/schema';
import { Player, UserPlayer } from './player';

export type Team = typeof teams.$inferSelect;
export type NewMovie = typeof teams.$inferInsert;
export type TeamWithPlayers = Team & { players: Array<Player | UserPlayer> };
