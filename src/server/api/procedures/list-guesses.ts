"use server";

import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import type { GuessAnswer } from "~/lib/models";
import { getSession } from "~/server/auth";
import { compareEntities } from "~/server/comparator";
import { getCurrentDate, touchTodayArtist } from "~/server/daily-picker";
import { findGuessedEntitiesForDay } from "~/server/db/entity-repository";
import { logger } from "~/server/logger";

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

export async function listGuesses(input?: string): Promise<GuessAnswer[]> {
  const session = await getSession();
  const date = fromIsoOrNow(input);
  if (!session?.user?.email) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const today = await touchTodayArtist(date);
  const guessess = await findGuessedEntitiesForDay(date, session.user?.email);
  return guessess.map((x) => compareEntities(today.entity, x));
}
