"use server";

import { LibsqlError } from "@libsql/client";
import { and, eq } from "drizzle-orm";
import { ConflictError, ThuunError } from "~/lib/errors";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { getGameForKey } from "~/server/db/entity-repository";
import { userGuess } from "~/server/db/schema";
import { logger } from "~/server/logger";

export async function guessArtist(
  artistId: number,
  gameKey: string,
): Promise<void> {
  const session = await getSession();
  const currentGame = await getGameForKey(gameKey);
  try {
    // TODO: Move this to repository so it can be locked/cache/busted
    const found = await db.$count(
      userGuess,
      and(
        eq(userGuess.gameId, currentGame.id),
        eq(userGuess.userId, session.user?.email || ""),
        eq(userGuess.entityId, currentGame.answerId),
      ),
    );
    if (found > 0) {
      logger.warn("answer already found");
      throw new ConflictError("Response already found for today");
    }
    await db.insert(userGuess).values({
      gameId: currentGame.id,
      userId: session.user?.email || "",
      entityId: artistId,
    });
    logger.info("%s guessed artist %s", session.user?.email, artistId);
  } catch (err) {
    if (err instanceof LibsqlError && err.code === "SQLITE_CONSTRAINT") {
      logger.warn("%s already guessed %s", session.user?.email, artistId);
      throw new ConflictError("Artist already guessed");
    }
    throw new ThuunError("Failed to create guess", { cause: err });
  }
}
