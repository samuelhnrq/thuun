import "server-only";

import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { wrap } from "@typeschema/valibot";
import { pipe, string, isoDateTime } from "valibot";
import { privateProcedure } from "../utils";
import type { DailyEntryWithEntity, GuessAnswer } from "~/lib/models";
import { getTodayArtist } from "~/server/dailyPicker";
import { dailyEntity, entityPropValue, userGuess } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "~/server/logger";

function fromIsoOrNow(input?: string): dayjs.Dayjs {
  if (input) {
    try {
      return dayjs(input);
    } catch (err) {
      logger.error("failed to parse date", input, err);
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
  }
  return dayjs();
}

export const listGuesses = privateProcedure
  .input(wrap(pipe(string(), isoDateTime())))
  .query(async ({ ctx: { db, session }, input }): Promise<GuessAnswer[]> => {
    const date = fromIsoOrNow(input);
    let today: DailyEntryWithEntity;
    try {
      today = await getTodayArtist();
    } catch (err) {
      if (err instanceof TRPCError && err.code === "NOT_FOUND") {
        return [];
      }
      throw err;
    }
    if (!session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const guesses = await db
      .select({ dailyEntity, entityPropValue })
      .from(userGuess)
      .innerJoin(dailyEntity, eq(userGuess.dailyEntryId, dailyEntity.id))
      .innerJoin(
        entityPropValue,
        eq(dailyEntity.entityId, entityPropValue.entityId),
      )
      .where(
        and(
          eq(userGuess.userId, session.user?.email),
          eq(dailyEntity.id, today.id),
        ),
      )
      .orderBy(userGuess.createdAt)
      .limit(10);
    return guesses.map((x) => compareEntities(today.entity, x));
  });
