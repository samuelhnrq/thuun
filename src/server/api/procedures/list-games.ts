"use server";

import { desc, eq } from "drizzle-orm";
import { ThuunError, UnauthorizedError } from "~/lib/errors";
import type { Game } from "~/lib/models";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { game } from "~/server/db/schema";
import { logger } from "~/server/logger";

export async function listGames(): Promise<Game[]> {
  const session = await getSession();
  const email = session?.user?.email;
  if (!email) {
    throw new UnauthorizedError();
  }
  try {
    logger.info("Listing games for %s", email);
    const games = await db
      .select()
      .from(game)
      .where(eq(game.author, email))
      .orderBy(desc(game.createdAt));
    return games;
  } catch (err) {
    logger.error("Failed to list games", err);
    if (!(err instanceof ThuunError)) {
      throw new ThuunError("Failed to list games", { cause: err });
    }
    throw err;
  }
}
