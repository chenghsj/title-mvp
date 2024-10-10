import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema',
  out: './drizzle',
  dbCredentials: {
    url:
      process.env.NODE_ENV === 'production'
        ? process.env.POSTGRES_URL!
        : process.env.POSTGRES_URL_DEV!,
  },
  verbose: true,
  strict: true,
});
