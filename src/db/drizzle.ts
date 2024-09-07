// import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { env } from '@/env';
// import * as schema from './schema';
// let db: PostgresJsDatabase<typeof schema>;
// let pg: ReturnType<typeof postgres>;
// if (env.NODE_ENV === 'production') {
//   pg = postgres(env.DATABASE_URL);
//   db = drizzle(pg, { schema });
// } else {
//   if (!(global as any).db!) {
//     pg = postgres(env.DATABASE_URL);
//     (global as any).db = drizzle(pg, { schema });
//   }
//   db = (global as any).db;
// }
// export { db, pg };

/**
 * Vercel
 */
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { env } from '@/env';
import * as schema from './schema';

let db: ReturnType<typeof drizzle>;

if (env.NODE_ENV === 'production') {
  // In production, create a new database connection
  db = drizzle(sql, { schema });
} else {
  // In development, use a global variable to preserve the connection
  if (!(global as any).db) {
    (global as any).db = drizzle(sql, { schema });
  }
  db = (global as any).db;
}

export { db };
