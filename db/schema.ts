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
  doublePrecision
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'user',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    name: text('name'),
    username: text('username').notNull().unique(),
    email: text('email').notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    auth0Id: text('auth0_id')
  },
  (user) => ({
    usernameIdx: index('users_username_idx').on(user.username),
    auth0IdIdx: index('users_auth0_id_idx').on(user.auth0Id)
  })
);

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export const teams = pgTable('team', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow()
});

export const players = pgTable(
  'player',
  {
    userId: uuid('user_id'),
    teamId: uuid('team_id')
      .references(() => teams.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 32 }).notNull()
  },
  (player) => ({
    teamIdx: index('players_team_idx').on(player.teamId),
    teamIdNameIdx: uniqueIndex('players_team_id_name_idx').on(
      player.teamId,
      player.userId,
      player.name
    )
  })
);

export const userRelations = relations(users, ({ many }) => ({
  teams: many(teams)
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  user: one(users, {
    fields: [teams.userId],
    references: [users.id]
  }),
  players: many(players)
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

export const gameModeEnum = pgEnum('game_mode', ['cricket', '501']);

export const game = pgTable('game', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  winner: uuid('winner').references(() => teams.id, { onDelete: 'cascade' }),
  gameMode: gameModeEnum('game_mode').notNull(),
  playedRounds: integer('played_rounds').notNull(),
  maxRounds: integer('max_rounds'),
  numbers: integer('numbers').array().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
});

export const game_teams = pgTable('game_teams', {
  gameId: uuid('game_id')
    .notNull()
    .references(() => game.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  pointsPerRound: doublePrecision('points_per_round').notNull()
});

export const game_player_stats = pgTable(
  'game_player_stats',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => game.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, {
      onDelete: 'set null'
    }),
    // no foreign key to player_id because players can be withoud user id (anonymous player),
    // so we can't enforce a foreign key constraint.
    // We can enforce it in the application layer. Stats wont be calculated for anonymous players.
    playerId: uuid('player_id').notNull(),
    doubles: integer('doubles').default(0).notNull(),
    triples: integer('triples').default(0).notNull(),
    pointsPerRound: doublePrecision('points_per_round').notNull(),
    thrownDarts: jsonb('thrown_darts').array().notNull()
  },
  (stats) => ({
    gamePlayerTeamIdx: uniqueIndex('game_player_team_idx').on(
      stats.teamId,
      stats.playerId,
      stats.gameId
    )
  })
);
