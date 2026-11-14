const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
  schema: "./src/db/schema.js",
  dialect: "sqlite",
  dbCredentials: { url: "file:dev.db" },
});
