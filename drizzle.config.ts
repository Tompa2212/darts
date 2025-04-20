import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { env } from './config';

dotenv.config({ path: './.env.local' });

export default {
  schema: './db/test.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  }
} satisfies Config;
