import { Pool } from '@neondatabase/serverless';
import { drizzle, type NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import * as schema from './test.schema';
import type { ExtractTablesWithRelations, Logger } from 'drizzle-orm';
import { env } from '../config';
import type { PgTransaction } from 'drizzle-orm/pg-core';

const pool = new Pool({ connectionString: env.DATABASE_URL });

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

const db = drizzle(pool, { schema, logger: new MyLogger() });

export default db;

// See https://neon.tech/docs/serverless/serverless-driver
// for more information

export type Transaction = PgTransaction<
  NeonQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
