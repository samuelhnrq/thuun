"use server";

import dayjs from "dayjs";
import { and, between, eq } from "drizzle-orm";
import { ConflictError, ThuunError, UnauthorizedError } from "~/lib/errors";
import type { Game } from "~/lib/models";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { game } from "~/server/db/schema";

export async function createGame(
  gameKey: string,
  answerId: number,
): Promise<Game> {
  const session = await getSession();
  const email = session?.user?.email;
  if (!email) {
    throw new UnauthorizedError();
  }
  try {
    const now = dayjs().utc();
    const ttl = await db.$count(
      game,
      and(
        eq(game.author, email),
        between(game.createdAt, now.subtract(1, "day").toDate(), now.toDate()),
      ),
    );
    if (ttl > 10) {
      throw new ConflictError("Too many games created today");
    }
    const newGames = await db
      .insert(game)
      .values({
        gameKey,
        author: email,
        answerId,
      })
      .returning();
    return newGames[0];
  } catch (err) {
    if (!(err instanceof ThuunError)) {
      throw new ThuunError("Failed to create game", { cause: err });
    }
    throw err;
  }
}
