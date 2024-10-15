import "server-only";

import { TRPCError } from "@trpc/server";
import { privateProcedure } from "../utils";
import { wrap } from "@typeschema/valibot";
import { number, pipe, minValue, integer } from "valibot";
import { db } from "~/server/database";
import type { GuessAnswer } from "~/lib/models";
import { userGuess } from "~/server/db/schema";
import { touchTodayArtist } from "~/server/dailyPicker";

export const guessArtist = privateProcedure
  .input(wrap(pipe(number(), integer(), minValue(0))))
  .mutation(
    async ({ input: artistId, ctx: { session } }): Promise<GuessAnswer> => {
      const todayAnswer = await touchTodayArtist();
      try {
        await db.insert(userGuess).values({
          dailyEntityId: todayAnswer.id,
          userId: session.user?.email || "",
          entityId: artistId,
        });
        return compareEntities(guessedArtist, guess);
      } catch (err) {
        if (isUniqueError(err)) {
          console.log("Already guessed");
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
    },
  );
