import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://ridenow:ridenow@localhost:5432/ridenow';

/**
 * postgres.js connects lazily on first query, so importing this module does not
 * open a socket — the health endpoint stays DB-independent. Feature stories
 * inject `db`; the scaffold only needs the typed wiring to exist.
 */
export const queryClient = postgres(connectionString, { max: 1 });
export const db = drizzle(queryClient, { schema });
export type Database = typeof db;
