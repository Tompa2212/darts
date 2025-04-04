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
  boolean,
  primaryKey,
  doublePrecision
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const statusEnum = pgEnum('status', ['active', 'deleted']);
export const teamTypeEnum = pgEnum('team_type', ['user', 'system']);

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

// --- Persistent Teams & Members ---

/** Represents persistent teams created by users. Can be single or multi-player. */
export const teams = pgTable(
  'teams',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    status: statusEnum('status').notNull().default('active'),
    type: teamTypeEnum('team_type').notNull().default('user'),
    ownerUserId: uuid('owner_user_id').references(() => users.id, {
      onDelete: 'cascade'
    }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow()
  },
  (t) => [index('teams_owner_idx').on(t.ownerUserId)]
);

export const teamMembers = pgTable(
  'team_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    userId: uuid('user_id'),
    name: varchar('name', { length: 100 }).notNull()
  },
  (tm) => [
    index('team_members_team_idx').on(tm.teamId),
    index('team_members_user_idx').on(tm.userId),
    uniqueIndex('team_members_team_user_unique').on(tm.teamId, tm.userId, tm.name)
  ]
);

// Only saving finished games, so status might be less critical, but good practice
export const gameModeEnum = pgEnum('game_mode', ['cricket', 'zero_one']);
export const gameStatusEnum = pgEnum('game_status', ['COMPLETED']);

/** Base table for all completed games */
export const games = pgTable(
  'games',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameMode: gameModeEnum('game_mode').notNull(),
    status: gameStatusEnum('game_status').notNull().default('COMPLETED'),
    creatorUserId: uuid('creator_user_id').references(() => users.id, {
      onDelete: 'set null'
    }),
    winningTeamId: uuid('winning_team_id').references(() => teams.id, {
      onDelete: 'set null'
    }),
    playedRounds: integer('played_rounds'),
    maxRounds: integer('max_rounds'),
    startedAt: timestamp('started_at', { mode: 'date' }),
    completedAt: timestamp('completed_at', { mode: 'date' }).notNull().defaultNow()
  },
  (g) => [
    index('games_creator_idx').on(g.creatorUserId),
    index('games_winner_idx').on(g.winningTeamId)
  ]
);

/** Junction table linking persistent teams participating in a game */
export const gameParticipants = pgTable(
  'game_participants',
  {
    gameId: uuid('game_id')
      .defaultRandom()
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    playOrder: integer('play_order')
  },
  (gp) => [
    primaryKey({ columns: [gp.gameId, gp.teamId] }),
    index('game_participants_team_idx').on(gp.teamId)
  ]
);

// --- Game Specific Detail Tables ---

export const gamesCricket = pgTable('games_cricket', {
  gameId: uuid('game_id')
    .primaryKey()
    .references(() => games.id, { onDelete: 'cascade' }),
  numbers: integer('numbers').array().notNull(),
  variant: varchar('variant', { length: 50 }).default('STANDARD') // e.g., CUT_THROAT
});

// --- Stats Tables (Linked to Game and Team Member) ---
// Storing aggregated stats since games are only saved when finished.

/** Team-level stats for a completed Cricket game */
export const gameStatsCricketTeam = pgTable(
  'game_stats_cricket_team',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    score: integer('score').notNull().default(0),
    pointsPerRound: doublePrecision('points_per_round').notNull().default(0),
    marksPerRound: doublePrecision('marks_per_round')
  },
  (t) => [
    primaryKey({ columns: [t.gameId, t.teamId] }),
    index('stats_cricket_team_game_idx').on(t.gameId)
  ]
);

/** Player-level (Team Member) stats for a completed Cricket game */
export const gameStatsCricketPlayer = pgTable(
  'game_stats_cricket_player',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    // Link to the specific team member who achieved these stats
    teamMemberId: uuid('team_member_id')
      .notNull()
      .references(() => teamMembers.id, { onDelete: 'cascade' }),
    // Also store teamId for easier querying of all player stats for a team in a game
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    singles: integer('singles').default(0).notNull(),
    doubles: integer('doubles').default(0).notNull(),
    triples: integer('triples').default(0).notNull(),
    misses: integer('misses').default(0).notNull(),
    marksPerRound: doublePrecision('marks_per_round'),
    marksPerDart: doublePrecision('marks_per_dart'),
    totalMarks: integer('total_marks').notNull(),
    playedTurns: integer('played_turns').notNull()
    // If storing raw throws, DO NOT put JSON here. Use a separate game_throws table.
    // thrownDarts: jsonb('thrown_darts').array(), // REMOVE THIS if using separate throws table
  },
  (t) => [
    index('stats_cricket_player_game_idx').on(t.gameId),
    index('stats_cricket_player_member_idx').on(t.teamMemberId),
    index('stats_cricket_player_team_idx').on(t.teamId), // Index for team-based queries
    // Ensures one stat entry per team member per game
    uniqueIndex('stats_cricket_player_game_member_unique').on(t.gameId, t.teamMemberId)
  ]
);

export const gamesX01 = pgTable('games_x01', {
  gameId: uuid('game_id')
    .primaryKey()
    .references(() => games.id, { onDelete: 'cascade' }),
  startScore: integer('start_score').notNull(), // Clearer name than gameType
  doubleIn: boolean('double_in').notNull().default(false),
  doubleOut: boolean('double_out').notNull().default(false),
  sets: integer('sets').notNull().default(1),
  legs: integer('legs').notNull().default(1),
  playedSets: integer('played_sets'), // Probably better in stats if needed
  playedLegs: integer('played_legs') // Probably better in stats if needed
});

/** Tracks individual set and leg results for X01 games */
export const gameX01SetLegResults = pgTable(
  'game_x01_set_leg_results',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(),
    legNumber: integer('leg_number').notNull(),
    startingScore: integer('starting_score').notNull(),
    remainingScore: integer('remaining_score').notNull(),
    dartsThrown: integer('darts_thrown').notNull(),
    averagePerDart: doublePrecision('average_per_dart'),
    checkoutType: varchar('checkout_type', { length: 20 }), // e.g., 'double', 'single', 'bull'
    isWon: boolean('is_won').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
  },
  (t) => [
    index('x01_set_leg_game_idx').on(t.gameId),
    index('x01_set_leg_team_idx').on(t.teamId),
    // Ensure one result per set/leg per team
    uniqueIndex('x01_set_leg_unique').on(t.gameId, t.teamId, t.setNumber, t.legNumber)
  ]
);

export const gameStatsX01Team = pgTable(
  'game_stats_x01_team',
  {
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    endScore: integer('end_score').notNull(),
    totalScore: integer('total_score').notNull(),
    turnsTaken: integer('turns_taken').notNull(),
    averageScorePerTurn: doublePrecision('average_score_per_turn').notNull(),
    highestScoreInSingleTurn: integer('highest_score_in_single_turn').notNull(),
    checkoutPercentage: doublePrecision('checkout_percentage').notNull(),
    setsWon: integer('sets_won').notNull().default(0),
    legsWon: integer('legs_won').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
  },
  (table) => [primaryKey({ columns: [table.gameId, table.teamId] })]
);

/** Player-level (Team Member) stats for a completed X01 game */
export const gameStatsX01Player = pgTable(
  'game_stats_x01_player',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    teamMemberId: uuid('team_member_id')
      .notNull()
      .references(() => teamMembers.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    // startingScore: integer('starting_score'), // This is in gamesX01 table
    // endScore: integer('end_score'), // Useful? Winner is 0, loser has remaining. Maybe store remaining_score?
    scoreRemaining: integer('score_remaining'), // Score left when game ended for this player
    totalScoreThrown: integer('total_score_thrown').notNull(),
    dartsThrown: integer('darts_thrown').notNull(), // More fundamental than turnsTaken
    // Use doublePrecision for averages
    averagePerDart: doublePrecision('average_per_dart'), // (totalScoreThrown / dartsThrown)
    averagePerTurn: doublePrecision('average_per_turn'), // (totalScoreThrown / (dartsThrown / 3)) - Careful with integer division
    checkoutPercentage: doublePrecision('checkout_percentage'), // Requires tracking attempts vs hits
    checkoutsAttempted: integer('checkouts_attempted').default(0),
    checkoutsMade: integer('checkouts_made').default(0),
    highestScore: integer('highest_score'), // Highest single turn score
    // Add specific X01 counts if desired (180s, 140+, 100+, etc.)
    scores180: integer('scores_180').default(0),
    scores100plus: integer('scores_100_plus').default(0) // e.g., 100-179
  },
  (t) => [
    index('stats_x01_player_game_idx').on(t.gameId),
    index('stats_x01_player_member_idx').on(t.teamMemberId),
    index('stats_x01_player_team_idx').on(t.teamId),
    uniqueIndex('stats_x01_player_game_member_unique').on(t.gameId, t.teamMemberId)
  ]
);

// --- Optional: Raw Throws Table ---
// Only include this if you need detailed throw-by-throw history for analysis
// beyond the aggregated stats. If included, calculate stats from this table on save,
// or remove redundant aggregated fields from stats tables.

export const gameThrows = pgTable(
  'game_throws',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    // Link to the specific team member who threw the dart
    teamMemberId: uuid('team_member_id')
      .notNull()
      .references(() => teamMembers.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }), // Denormalized for filtering
    turnNumber: integer('turn_number').notNull(),
    throwNumberInTurn: integer('throw_number_in_turn').notNull(), // 1, 2, or 3
    segmentHit: integer('segment_hit').notNull(), // 0-20, 25=SB, 50=DB
    multiplier: integer('multiplier').notNull(), // 0=Miss, 1, 2, 3
    // score: integer('score'), // Optional precalculated score for this dart (segment * multiplier)
    timestamp: timestamp('timestamp', { mode: 'date' }).defaultNow() // Timestamp of the throw
  },
  (t) => [
    uniqueIndex('game_throw_unique').on(
      t.gameId,
      t.teamMemberId,
      t.turnNumber,
      t.throwNumberInTurn
    ),
    index('game_throw_game_member_idx').on(t.gameId, t.teamMemberId),
    index('game_throw_game_team_idx').on(t.gameId, t.teamId)
  ] // Index for team-based queries
);

// --- Drizzle Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  ownedTeams: many(teams, { relationName: 'ownedTeams' }),
  teamMemberships: many(teamMembers),
  createdGames: many(games, { relationName: 'createdGames' })
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerUserId],
    references: [users.id],
    relationName: 'ownedTeams'
  }),
  members: many(teamMembers),
  x01SetLegResults: many(gameX01SetLegResults)
}));

export const teamMembersRelations = relations(teamMembers, ({ one, many }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id]
  }),
  user: one(users, {
    // Link back to the user account, if exists
    fields: [teamMembers.userId],
    references: [users.id]
  }),
  statsCricketPlayer: many(gameStatsCricketPlayer),
  statsX01Player: many(gameStatsX01Player),
  throws: many(gameThrows) // if using gameThrows table
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  creator: one(users, {
    fields: [games.creatorUserId],
    references: [users.id],
    relationName: 'createdGames'
  }),
  participants: many(gameParticipants),
  winningTeam: one(teams, {
    fields: [games.winningTeamId],
    references: [teams.id],
    relationName: 'gamesWon'
  }),
  detailsCricket: one(gamesCricket, {
    // Link to specific game type details
    fields: [games.id],
    references: [gamesCricket.gameId]
  }),
  detailsX01: one(gamesX01, {
    // Link to specific game type details
    fields: [games.id],
    references: [gamesX01.gameId]
  }),
  statsCricketTeam: many(gameStatsCricketTeam),
  statsCricketPlayer: many(gameStatsCricketPlayer),
  statsX01Player: many(gameStatsX01Player),
  throws: many(gameThrows), // if using gameThrows table
  x01SetLegResults: many(gameX01SetLegResults)
}));

export const gamesCricketRelations = relations(gamesCricket, ({ one }) => ({
  game: one(games, {
    fields: [gamesCricket.gameId],
    references: [games.id]
  })
}));

export const gameParticipantsRelations = relations(gameParticipants, ({ one }) => ({
  game: one(games, {
    fields: [gameParticipants.gameId],
    references: [games.id]
  }),
  team: one(teams, {
    fields: [gameParticipants.teamId],
    references: [teams.id]
  })
}));

// Relations for Stats tables linking back...
export const gameStatsCricketTeamRelations = relations(gameStatsCricketTeam, ({ one }) => ({
  game: one(games, {
    fields: [gameStatsCricketTeam.gameId],
    references: [games.id]
  }),
  team: one(teams, {
    fields: [gameStatsCricketTeam.teamId],
    references: [teams.id]
  })
}));

export const gameStatsCricketPlayerRelations = relations(gameStatsCricketPlayer, ({ one }) => ({
  game: one(games, {
    fields: [gameStatsCricketPlayer.gameId],
    references: [games.id]
  }),
  teamMember: one(teamMembers, {
    fields: [gameStatsCricketPlayer.teamMemberId],
    references: [teamMembers.id]
  }),
  team: one(teams, {
    fields: [gameStatsCricketPlayer.teamId],
    references: [teams.id]
  })
}));

export const gameStatsX01PlayerRelations = relations(gameStatsX01Player, ({ one }) => ({
  game: one(games, {
    fields: [gameStatsX01Player.gameId],
    references: [games.id]
  }),
  teamMember: one(teamMembers, {
    fields: [gameStatsX01Player.teamMemberId],
    references: [teamMembers.id]
  }),
  team: one(teams, {
    fields: [gameStatsX01Player.teamId],
    references: [teams.id]
  })
}));

// Relations for gameThrows if using it...
export const gameThrowsRelations = relations(gameThrows, ({ one }) => ({
  game: one(games, { fields: [gameThrows.gameId], references: [games.id] }),
  teamMember: one(teamMembers, {
    fields: [gameThrows.teamMemberId],
    references: [teamMembers.id]
  }),
  team: one(teams, { fields: [gameThrows.teamId], references: [teams.id] })
}));

// Add relations for the new table
export const gameX01SetLegResultsRelations = relations(gameX01SetLegResults, ({ one }) => ({
  game: one(games, {
    fields: [gameX01SetLegResults.gameId],
    references: [games.id]
  }),
  team: one(teams, {
    fields: [gameX01SetLegResults.teamId],
    references: [teams.id]
  })
}));
