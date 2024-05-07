import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  index,
  uuid,
  varchar,
  pgEnum,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'user',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    name: text('name'),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    email: text('email').notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image')
  },
  (user) => ({
    usernameIdx: index('users_username_idx').on(user.username)
  })
);

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId]
    })
  })
);

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
  })
);

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

// Relations
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
  score: integer('score').notNull()
});

export const game_player_stats = pgTable('game_player_stats', {
  gameId: uuid('game_id')
    .notNull()
    .references(() => game.id, { onDelete: 'cascade' }),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  playerId: uuid('player_id')
    .notNull()
    .references(() => players.userId, { onDelete: 'cascade' }),
  doubles: integer('doubles').default(0).notNull(),
  triples: integer('triples').default(0).notNull()
});
