import "server-only";

import type { GuessAnswer } from "@/lib/models";
import { db } from "@/server/db";
import { compareEntities } from "@/server/lib/comparator";
import {
  INCLUDE_ENTITY_WITH_PROPS,
  getTodayArtist,
} from "@/server/lib/dailyPicker";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "../trpc";

function isUniqueError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P202"
  );
}

export const guessArtist = protectedProcedure
  .input(z.number().positive())
  .mutation(
    async ({ input: artistId, ctx: { session } }): Promise<GuessAnswer> => {
      const guessedArtist = await db.entity.findUniqueOrThrow({
        where: { id: artistId },
        include: { props: { include: { prop: true } } },
      });
      const todayAnswer = await getTodayArtist();
      try {
        const guess = await db.userGuess.create({
          data: {
            userId: session.user?.email || "",
            dayId: todayAnswer.id,
            guessId: artistId,
          },
          include: {
            guess: { include: INCLUDE_ENTITY_WITH_PROPS.entity.include },
          },
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
