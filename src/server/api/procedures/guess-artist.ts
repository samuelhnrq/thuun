"use server";

import { LibsqlError } from "@libsql/client";
import { TRPCError } from "@trpc/server";
import { getSession } from "~/server/auth";
import { touchTodayArtist } from "~/server/daily-picker";
import { db } from "~/server/db/client";
import { userGuess } from "~/server/db/schema";
import { logger } from "~/server/logger";

export async function guessArtist(artistId: number): Promise<void> {
  const session = await getSession();
  const todayAnswer = await touchTodayArtist();
  try {
    await db.insert(userGuess).values({
      dailyEntityId: todayAnswer.id,
      userId: session.user?.email || "",
      entityId: artistId,
    });
    logger.info("%s guessed artist %s", session.user?.email, artistId);
  } catch (err) {
    if (err instanceof LibsqlError && err.code === "SQLITE_CONSTRAINT") {
      logger.warn("%s already guessed %s", session.user?.email, artistId);
      throw new TRPCError({
        code: "CONFLICT",
        message: "Artist already guessed",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create guess",
    });
  }
}
