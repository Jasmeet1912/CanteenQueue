import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// libsql = SQLite that installs with plain `npm install` (no C++ compiler needed).
// Reuse one connection during hot reload in dev.
const g = globalThis ;
const client = g.dbClient ?? createClient({
  url: process.env.DATABASE_URL ?? "file:dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
if (process.env.NODE_ENV !== "production") g.dbClient = client;

export const db = drizzle(client, { schema });

