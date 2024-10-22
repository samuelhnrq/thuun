import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { logger } from "../logger";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not set");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, {
  logger: {
    logQuery(originalQuery, params) {
      const query = originalQuery.replace(/"/g, "`");
      logger.trace({ query, params }, "Query");
    },
  },
});
