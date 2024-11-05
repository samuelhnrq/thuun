"use server";

import type { GuessAnswer } from "~/lib/models";
import { getSession } from "~/server/auth";
import { compareEntities } from "~/server/comparator";
import { getCurrentDate, touchTodayArtist } from "~/server/daily-picker";
import { findGuessedEntitiesForDay } from "~/server/db/entity-repository";
import { UnauthorizedError } from "~/server/lib/errors";

export async function listGuesses(input?: string): Promise<GuessAnswer[]> {
  const session = await getSession();
  const date = getCurrentDate(input);
  if (!session?.user?.email) {
    throw new UnauthorizedError();
  }
  const today = await touchTodayArtist(date);
  const guesses = await findGuessedEntitiesForDay(date, session.user?.email);
  return guesses.map((x) => compareEntities(today.entity, x));
}
