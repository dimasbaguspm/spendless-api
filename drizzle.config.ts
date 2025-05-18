import type { Config } from 'drizzle-kit';

// Parse the database URL to extract components
const dbUrl = new URL(process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/spendless');

export default {
  schema: './src/models/schema.ts',
  out: './src/core/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1), // Remove the leading '/'
  },
} satisfies Config;
