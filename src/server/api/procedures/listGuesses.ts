import "server-only";

import { TRPCError } from "@trpc/server";
import { wrap } from "@typeschema/valibot";
import dayjs from "dayjs";
import { isoDateTime, pipe, string } from "valibot";
import type { GuessAnswer } from "~/lib/models";
import { compareEntities } from "~/server/comparator";
import { getCurrentDate, touchTodayArtist } from "~/server/dailyPicker";
import { findGuessedEntitiesForDay } from "~/server/db/entity-repository";
import { logger } from "~/server/logger";
import { privateProcedure } from "../utils";

function fromIsoOrNow(input?: string): Date {
  if (input) {
    try {
      return dayjs(input).startOf("day").toDate();
    } catch (err) {
      logger.error("failed to parse date", input, err);
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
  }
  return getCurrentDate();
}

export const listGuesses = privateProcedure
  .input(wrap(pipe(string(), isoDateTime())))
  .query(async ({ ctx: { session }, input }): Promise<GuessAnswer[]> => {
    const date = fromIsoOrNow(input);
    if (!session?.user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const today = await touchTodayArtist(date);
    const guessess = await findGuessedEntitiesForDay(date, session.user?.email);
    return guessess.map((x) => compareEntities(today.entity, x));
  });
