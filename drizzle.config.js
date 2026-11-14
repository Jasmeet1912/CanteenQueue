const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
  schema: "./src/db/schema.js",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
