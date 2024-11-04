"use server";

import { LibsqlError } from "@libsql/client";
import { and, count, eq } from "drizzle-orm";
import { getSession } from "~/server/auth";
import { touchTodayArtist } from "~/server/daily-picker";
import { db } from "~/server/db/client";
import { userGuess } from "~/server/db/schema";
import { ConflictError, ThuunError } from "~/server/lib/errors";
import { logger } from "~/server/logger";

export async function guessArtist(artistId: number): Promise<void> {
  const session = await getSession();
  const todayAnswer = await touchTodayArtist();
  try {
    const [{ found = 0 } = {}] = await db
      .select({ found: count() })
      .from(userGuess)
      .where(
        and(
          eq(userGuess.dailyEntityId, todayAnswer.id),
          eq(userGuess.userId, session.user?.email || ""),
          eq(userGuess.entityId, todayAnswer.entityId),
        ),
      );
    if (found > 0) {
      logger.warn("answer already found");
      throw new ConflictError("Response already found for today");
    }
    await db.insert(userGuess).values({
      dailyEntityId: todayAnswer.id,
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
