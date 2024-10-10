import { sql } from '@vercel/postgres';
import {
  PostgresJsDatabase,
  drizzle as drizzleNode,
} from 'drizzle-orm/postgres-js';
import {
  VercelPgDatabase,
  drizzle as drizzleVercel,
} from 'drizzle-orm/vercel-postgres';
import postgres from 'postgres';
import * as CandidateSchema from './schema/candidate';
import * as UserSchema from './schema/user';

const schema = {
  ...CandidateSchema,
  ...UserSchema,
};

let db: PostgresJsDatabase<typeof schema> | VercelPgDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;
if (process.env.NODE_ENV === 'production') {
  db = drizzleVercel(sql, { schema });
} else {
  if (!(global as any).db!) {
    pg = postgres(process.env.POSTGRES_URL_DEV ?? '');
    (global as any).db = drizzleNode(pg, { schema });
  }
  db = (global as any).db;
}
export { db, pg };

/**
 * Vercel
 */
// import { createPool, sql } from '@vercel/postgres';
// import { VercelPgDatabase, drizzle } from 'drizzle-orm/vercel-postgres';
// import * as schema from './schema';

// let db: VercelPgDatabase<typeof schema>;

// if (process.env.NODE_ENV === 'production') {
//   // In production, create a new database connection
//   db = drizzle(sql, { schema });
// } else {
//   const client = createPool({ connectionString: process.env.POSTGRES_URL });
//   // In development, use a global variable to preserve the connection
//   if (!(global as any).db) {
//     (global as any).db = drizzle(client, { schema });
//   }
//   db = (global as any).db;
// }

// export { db };
