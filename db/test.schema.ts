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
  numeric
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    name: text('name'),
    username: text('username').notNull().unique(),
    email: text('email').notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
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
    status: varchar('status').notNull().default('active'),
    ownerUserId: uuid('owner_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow() // Consider adding $onUpdate trigger
  },
  (t) => [index('teams_owner_idx').on(t.ownerUserId)]
);

/** Links players (user accounts or anonymous names) to persistent teams. */
export const teamMembers = pgTable(
  'team_members',
  {
    // Use SERIAL or UUID for the member link ID
    id: uuid('id').primaryKey(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    // Link to the user account if this member is a registered user
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null'
    }), // Set null if user account deleted? Or cascade? Depends on requirements.
    // Display name used for this player within this team context
    displayName: varchar('display_name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow()
    // Add other member-specific info if needed (e.g., is_captain, status)
  },
  (tm) => ({
    teamIdx: index('team_members_team_idx').on(tm.teamId),
    userIdx: index('team_members_user_idx').on(tm.userId),
    // Constraint: A registered user can only be on a specific team once.
    uniqueUserPerTeam: uniqueIndex('team_members_team_user_unique').on(
      tm.teamId,
      tm.userId
    )
  })
);

// --- Game Tables (CTI Approach) ---

export const gameModeEnum = pgEnum('game_mode', ['CRICKET', 'X01']);
// Only saving finished games, so status might be less critical, but good practice
export const gameStatusEnum = pgEnum('game_status', ['COMPLETED']);

/** Base table for all completed games */
export const games = pgTable(
  'games',
  {
    id: uuid('id').primaryKey(),
    gameMode: gameModeEnum('game_mode').notNull(),
    status: gameStatusEnum('game_status').notNull().default('COMPLETED'),
    // User who initiated saving the game (might be different from team owner)
    creatorUserId: uuid('creator_user_id').references(() => users.id, {
      onDelete: 'set null'
    }),
    // Reference to the persistent team that won
    winningTeamId: uuid('winning_team_id').references(() => teams.id, {
      onDelete: 'set null'
    }),
    playedRounds: integer('played_rounds'), // Common enough to keep here? Or move to specific tables?
    maxRounds: integer('max_rounds'), // Common enough to keep here? Or move to specific tables?
    startedAt: timestamp('started_at', { mode: 'date' }), // Optional: When the game actually started
    completedAt: timestamp('completed_at', { mode: 'date' })
      .notNull()
      .defaultNow()
  },
  (g) => [
    index('games_game_mode_idx').on(g.gameMode),
    index('games_creator_idx').on(g.creatorUserId),
    index('games_winner_idx').on(g.winningTeamId)
  ]
);

/** Junction table linking persistent teams participating in a game */
export const gameParticipants = pgTable(
  'game_participants',
  {
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    // Reference to the persistent team that played
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
  gameId: integer('game_id')
    .primaryKey()
    .references(() => games.id, { onDelete: 'cascade' }),
  // Cricket specific fields from your original schema
  numbers: integer('numbers').array().notNull(),
  variant: varchar('variant', { length: 50 }).default('STANDARD') // e.g., CUT_THROAT
});

export const gamesX01 = pgTable('games_x01', {
  gameId: integer('game_id')
    .primaryKey()
    .references(() => games.id, { onDelete: 'cascade' }),
  // X01 specific fields from your original schema
  startScore: integer('start_score').notNull(), // Clearer name than gameType
  doubleIn: boolean('double_in').notNull().default(false),
  doubleOut: boolean('double_out').notNull().default(true),
  // These might belong here or could be calculated/stored with stats if needed
  sets: integer('sets').notNull().default(1),
  legs: integer('legs').notNull().default(1)
  // playedSets: integer('played_sets'), // Probably better in stats if needed
  // playedLegs: integer('played_legs'), // Probably better in stats if needed
});

// --- Stats Tables (Linked to Game and Team Member) ---
// Storing aggregated stats since games are only saved when finished.

/** Team-level stats for a completed Cricket game */
export const gameStatsCricketTeam = pgTable(
  'game_stats_cricket_team',
  {
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    score: integer('score').notNull().default(0),
    // Use numeric for potentially fractional values like averages
    pointsPerRound: numeric('points_per_round').notNull().default('0'),
    marksPerRound: numeric('marks_per_round')
  },
  (t) => ({
    pk: primaryKey({ columns: [t.gameId, t.teamId] }),
    gameIdx: index('stats_cricket_team_game_idx').on(t.gameId)
  })
);

/** Player-level (Team Member) stats for a completed Cricket game */
export const gameStatsCricketPlayer = pgTable(
  'game_stats_cricket_player',
  {
    id: uuid('id').primaryKey(),
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    // Link to the specific team member who achieved these stats
    teamMemberId: integer('team_member_id')
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
    marksPerRound: numeric('marks_per_round'),
    marksPerDart: numeric('marks_per_dart'),
    totalMarks: integer('total_marks').notNull(),
    playedTurns: integer('played_turns').notNull()
    // If storing raw throws, DO NOT put JSON here. Use a separate game_throws table.
    // thrownDarts: jsonb('thrown_darts').array(), // REMOVE THIS if using separate throws table
  },
  (t) => ({
    gameIdx: index('stats_cricket_player_game_idx').on(t.gameId),
    memberIdx: index('stats_cricket_player_member_idx').on(t.teamMemberId),
    teamIdx: index('stats_cricket_player_team_idx').on(t.teamId), // Index for team-based queries
    // Ensures one stat entry per team member per game
    uniqueStatEntry: uniqueIndex('stats_cricket_player_game_member_unique').on(
      t.gameId,
      t.teamMemberId
    )
  })
);

/** Player-level (Team Member) stats for a completed X01 game */
export const gameStatsX01Player = pgTable(
  'game_stats_x01_player',
  {
    id: uuid('id').primaryKey(),
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    teamMemberId: integer('team_member_id')
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
    // Use numeric for averages
    averagePerDart: numeric('average_per_dart'), // (totalScoreThrown / dartsThrown)
    averagePerTurn: numeric('average_per_turn'), // (totalScoreThrown / (dartsThrown / 3)) - Careful with integer division
    checkoutPercentage: numeric('checkout_percentage'), // Requires tracking attempts vs hits
    checkoutsAttempted: integer('checkouts_attempted').default(0),
    checkoutsMade: integer('checkouts_made').default(0),
    highestScore: integer('highest_score'), // Highest single turn score
    // Add specific X01 counts if desired (180s, 140+, 100+, etc.)
    scores180: integer('scores_180').default(0),
    scores100plus: integer('scores_100_plus').default(0) // e.g., 100-179
  },
  (t) => ({
    gameIdx: index('stats_x01_player_game_idx').on(t.gameId),
    memberIdx: index('stats_x01_player_member_idx').on(t.teamMemberId),
    teamIdx: index('stats_x01_player_team_idx').on(t.teamId),
    uniqueStatEntry: uniqueIndex('stats_x01_player_game_member_unique').on(
      t.gameId,
      t.teamMemberId
    )
  })
);

// --- Optional: Raw Throws Table ---
// Only include this if you need detailed throw-by-throw history for analysis
// beyond the aggregated stats. If included, calculate stats from this table on save,
// or remove redundant aggregated fields from stats tables.

export const gameThrows = pgTable(
  'game_throws',
  {
    id: uuid('id').primaryKey(),
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    // Link to the specific team member who threw the dart
    teamMemberId: integer('team_member_id')
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
  (t) => ({
    gameMemberTurnThrowIdx: uniqueIndex('game_throw_unique').on(
      t.gameId,
      t.teamMemberId,
      t.turnNumber,
      t.throwNumberInTurn
    ),
    gameMemberIdx: index('game_throw_game_member_idx').on(
      t.gameId,
      t.teamMemberId
    ),
    gameTeamIdx: index('game_throw_game_team_idx').on(t.gameId, t.teamId) // Index for team-based queries
  })
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
  gamesParticipated: many(gameParticipants),
  gamesWon: many(games, { relationName: 'gamesWon' }), // Games where this team is the winner
  statsCricketTeam: many(gameStatsCricketTeam)
  // Add relations for other team stats if needed
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
  throws: many(gameThrows) // if using gameThrows table
}));

export const gameParticipantsRelations = relations(
  gameParticipants,
  ({ one }) => ({
    game: one(games, {
      fields: [gameParticipants.gameId],
      references: [games.id]
    }),
    team: one(teams, {
      fields: [gameParticipants.teamId],
      references: [teams.id]
    })
  })
);

// Relations for Stats tables linking back...
export const gameStatsCricketTeamRelations = relations(
  gameStatsCricketTeam,
  ({ one }) => ({
    game: one(games, {
      fields: [gameStatsCricketTeam.gameId],
      references: [games.id]
    }),
    team: one(teams, {
      fields: [gameStatsCricketTeam.teamId],
      references: [teams.id]
    })
  })
);

export const gameStatsCricketPlayerRelations = relations(
  gameStatsCricketPlayer,
  ({ one }) => ({
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
  })
);

export const gameStatsX01PlayerRelations = relations(
  gameStatsX01Player,
  ({ one }) => ({
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
  })
);

// Relations for gameThrows if using it...
export const gameThrowsRelations = relations(gameThrows, ({ one }) => ({
  game: one(games, { fields: [gameThrows.gameId], references: [games.id] }),
  teamMember: one(teamMembers, {
    fields: [gameThrows.teamMemberId],
    references: [teamMembers.id]
  }),
  team: one(teams, { fields: [gameThrows.teamId], references: [teams.id] })
}));
