import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './test.schema';
import type { Logger } from 'drizzle-orm';

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL! });

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

const db = drizzle(pool, { schema, logger: new MyLogger() });

export default db;

// See https://neon.tech/docs/serverless/serverless-driver
// for more information
