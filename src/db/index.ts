import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Reuse one connection during hot reload in dev.
const g = globalThis as unknown as { sqlite?: Database.Database };
const sqlite = g.sqlite ?? new Database(process.env.DATABASE_URL ?? "dev.db");
sqlite.pragma("foreign_keys = ON");
if (process.env.NODE_ENV !== "production") g.sqlite = sqlite;

export const db = drizzle(sqlite, { schema });
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
