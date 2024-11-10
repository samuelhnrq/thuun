import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || ":memory:",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  migrations: {
    prefix: "unix",
  },
  strict: true,
});
