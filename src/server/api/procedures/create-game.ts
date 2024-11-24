"use server";

import dayjs from "dayjs";
import { and, between, eq } from "drizzle-orm";
import { ConflictError, ThuunError, UnauthorizedError } from "~/lib/errors";
import type { Game } from "~/lib/models";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { dailyArtistCache } from "~/server/db/entity-repository";
import { game } from "~/server/db/schema";
import { logger } from "~/server/logger";

export async function createGame(
  gameKey: string,
  answerId: number,
): Promise<Game> {
  const session = await getSession();
  const email = session?.user?.email;
  if (!email) {
    throw new UnauthorizedError();
  }
  try {
    logger.info("Creating game for %s", gameKey);
    const now = dayjs().utc();
    const ttl = await db.$count(
      game,
      and(
        eq(game.author, email),
        between(game.createdAt, now.subtract(1, "day").toDate(), now.toDate()),
      ),
    );
    if (ttl > 10) {
      throw new ConflictError("Too many games created today");
    }
    await dailyArtistCache.createEntry(gameKey, () => answerId, email);
    const created = await dailyArtistCache.get(gameKey);
    if (!created) {
      throw new ThuunError("Failed to create game");
    }
    return created;
  } catch (err) {
    logger.error("Failed to create game %s", err);
    if (!(err instanceof ThuunError)) {
      throw new ThuunError("Failed to create game", { cause: err });
    }
    throw err;
  }
}
