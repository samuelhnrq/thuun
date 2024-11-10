"use server";

import { UnauthorizedError } from "~/lib/errors";
import type { GuessAnswer } from "~/lib/models";
import { getSession } from "~/server/auth";
import { compareEntities } from "~/server/comparator";
import {
  createDailyEntry,
  findAlreadyGuessed,
  getGameForKey,
} from "~/server/db/entity-repository";

export async function listGuesses(gameKey: string): Promise<GuessAnswer[]> {
  const session = await getSession();
  if (!session?.user?.email) {
    throw new UnauthorizedError();
  }
  await createDailyEntry();
  const game = await getGameForKey(gameKey);
  const guesses = await findAlreadyGuessed(game.gameKey, session.user?.email);
  return guesses.map((x) => compareEntities(game.answer, x));
}
