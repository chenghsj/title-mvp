import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const pg = postgres(process.env.DATABASE_URL ?? '');

const db = drizzle(pg, { schema });

export { db, pg };
