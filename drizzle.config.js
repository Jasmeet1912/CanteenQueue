try { process.loadEnvFile(".env"); } catch {}

const { defineConfig } = require("drizzle-kit");

const url = process.env.DATABASE_URL ?? "file:dev.db";
const remote = url.startsWith("libsql:") || url.startsWith("https:");

module.exports = defineConfig({
  schema: "./src/db/schema.js",
  dialect: remote ? "turso" : "sqlite",
  dbCredentials: remote ? { url, authToken: process.env.DATABASE_AUTH_TOKEN } : { url },
});