"use server";

import type { GuessAnswer } from "~/lib/models";
import { getSession } from "~/server/auth";
import { compareEntities } from "~/server/comparator";
import { touchTodayGame } from "~/server/daily-picker";
import {
  findAlreadyGuessed,
  getGameForKey,
} from "~/server/db/entity-repository";
import { UnauthorizedError } from "~/lib/errors";

export async function listGuesses(gameKey: string): Promise<GuessAnswer[]> {
  const session = await getSession();
  if (!session?.user?.email) {
    throw new UnauthorizedError();
  }
  const game = await getGameForKey(gameKey);
  const today = await touchTodayGame();
  const guesses = await findAlreadyGuessed(game.gameKey, session.user?.email);
  return guesses.map((x) => compareEntities(today.answer, x));
}
