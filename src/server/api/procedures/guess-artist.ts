import { LibsqlError } from "@libsql/client";
import { TRPCError } from "@trpc/server";
import { wrap } from "@typeschema/valibot";
import { integer, minValue, number, pipe } from "valibot";
import { touchTodayArtist } from "~/server/daily-picker";
import { db } from "~/server/db/client";
import { userGuess } from "~/server/db/schema";
import { logger } from "~/server/logger";
import { privateProcedure } from "../utils";

export const guessArtist = privateProcedure
  .input(wrap(pipe(number(), integer(), minValue(0))))
  .mutation(async ({ input: artistId, ctx: { session } }): Promise<void> => {
    const todayAnswer = await touchTodayArtist();
    try {
      await db.insert(userGuess).values({
        dailyEntityId: todayAnswer.id,
        userId: session.user?.email || "",
        entityId: artistId,
      });
    } catch (err) {
      if (err instanceof LibsqlError) {
        logger.info("Already guessed");
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
  });
