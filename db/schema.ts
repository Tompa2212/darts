import {
  timestamp,
  pgTable,
  text,
  integer,
  index,
  uuid,
  varchar,
  pgEnum,
  uniqueIndex,
  jsonb,
  doublePrecision,
  boolean
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const gameModeEnum = pgEnum('game_mode', ['cricket', 'zero_one']);
export const statusEnum = pgEnum('status', ['active', 'deleted']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    name: text('name'),
    username: text('username').notNull().unique(),
    email: text('email').notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    status: statusEnum('status').notNull().default('active'),
    auth0Id: text('auth0_id')
  },
  (user) => [
    index('users_username_idx').on(user.username),
    index('users_auth0_id_idx').on(user.auth0Id)
  ]
);

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export const teams = pgTable('teams', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: statusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow()
});

export const players = pgTable(
  'players',
  {
    userId: uuid('user_id'),
    teamId: uuid('team_id')
      .references(() => teams.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 32 }).notNull()
  },
  (player) => [
    index('players_team_idx').on(player.teamId),
    uniqueIndex('players_team_id_name_idx').on(player.teamId, player.userId, player.name)
  ]
);

export const cricketGame = pgTable('cricket_games', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  creator: uuid('creator')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  winner: uuid('winner')
    .references(() => teams.id, { onDelete: 'cascade' })
    .notNull(),
  gameMode: gameModeEnum('game_mode').notNull(),
  playedRounds: integer('played_rounds').notNull(),
  maxRounds: integer('max_rounds'),
  numbers: integer('numbers').array().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
});

export const cricketGameTeam = pgTable('cricket_game_teams', {
  gameId: uuid('game_id')
    .notNull()
    .references(() => cricketGame.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  pointsPerRound: doublePrecision('points_per_round').notNull(),
  marksPerRound: doublePrecision('marks_per_round'),
  roundsPlayed: integer('rounds_played')
});

export const cricketGamePlayerStats = pgTable('cricket_game_player_stats', {
  gameId: uuid('game_id')
    .notNull()
    .references(() => cricketGame.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id').references(() => teams.id, {
    onDelete: 'no action'
  }),
  // no foreign key to player_id because players can be withoud user id (anonymous player),
  // so we can't enforce a foreign key constraint.
  // We can enforce it in the application layer. Stats wont be calculated for anonymous players.
  playerId: uuid('player_id').notNull(),
  singles: integer('singles').default(0).notNull(),
  doubles: integer('doubles').default(0).notNull(),
  triples: integer('triples').default(0).notNull(),
  misses: integer('misses').default(0).notNull(),
  marksPerRound: doublePrecision('marks_per_round').notNull(),
  marksPerDart: doublePrecision('marks_per_dart').notNull(),
  totalMarks: integer('total_marks').notNull(),
  playedTurns: integer('played_turns').notNull(),
  thrownDarts: jsonb('thrown_darts').array().notNull()
});

export const zeroOneGame = pgTable('zero_one_games', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  creator: uuid('creator')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  winner: uuid('winner')
    .references(() => teams.id, { onDelete: 'cascade' })
    .notNull(),
  gameMode: gameModeEnum('game_mode').notNull(),
  gameType: text('game_type').notNull(),
  playedRounds: integer('played_rounds').notNull(),
  maxRounds: integer('max_rounds'),
  sets: integer('sets').notNull(),
  legs: integer('legs').notNull(),
  playedSets: integer('played_sets').notNull(),
  playedLegs: integer('played_legs').notNull(),
  doubleOut: boolean('double_out').notNull(),
  doubleIn: boolean('double_in').notNull()
});

export const zeroOneGamePlayerStats = pgTable(
  'zero_one_game_player_stats',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => zeroOneGame.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, {
      onDelete: 'no action'
    }),
    playerId: uuid('player_id').notNull(),
    startingScore: integer('starting_score').notNull(),
    endScore: integer('end_score').notNull(),
    totalScore: integer('total_score').notNull(),
    turnsTaken: integer('turns_taken').notNull(),
    averageScorePerTurn: doublePrecision('average_score_per_turn').notNull(),
    highestScoreInSingleTurn: integer('highest_score_in_single_turn').notNull(),
    checkoutPercentage: doublePrecision('checkout_percentage').notNull()
  }
  // (stats) => [
  //   primaryKey({ columns: [stats.teamId, stats.playerId, stats.gameId] })
  // ]
);

export const userRelations = relations(users, ({ many }) => ({
  teams: many(teams),
  games: many(cricketGame)
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  user: one(users, {
    fields: [teams.userId],
    references: [users.id]
  }),
  players: many(players),
  gameTeams: many(cricketGameTeam)
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id]
  }),
  user: one(users, {
    fields: [players.userId],
    references: [users.id]
  })
}));

export const cricketGamesRelations = relations(cricketGame, ({ one, many }) => ({
  user: one(users, {
    fields: [cricketGame.creator],
    references: [users.id]
  }),
  gameTeams: many(cricketGameTeam),
  winner: one(teams, {
    fields: [cricketGame.winner],
    references: [teams.id]
  })
}));

export const cricketGameTeamsRelations = relations(cricketGameTeam, ({ one }) => ({
  game: one(cricketGame, {
    fields: [cricketGameTeam.gameId],
    references: [cricketGame.id]
  }),
  team: one(teams, {
    fields: [cricketGameTeam.teamId],
    references: [teams.id]
  })
}));
