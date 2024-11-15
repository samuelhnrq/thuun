"use server";

import { and, asc, eq, isNull, like, ne, or } from "drizzle-orm";
import { UnauthorizedError } from "~/lib/errors";
import type { EntitySearchResult } from "~/lib/models";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { getGameForKey } from "~/server/db/entity-repository";
import { entity, game, userGuess } from "~/server/db/schema";

const searchArtist = async (
  q: string,
  gameKey: string,
): Promise<EntitySearchResult[]> => {
  const session = await getSession();
  const email = session.user?.email;
  if (!email) {
    throw new UnauthorizedError();
  }
  const currentGame = await getGameForKey(gameKey);
  let condition = or(
    isNull(userGuess.id),
    ne(game.gameKey, currentGame.gameKey),
  );

  if (q.length < 3) {
    condition = and(condition, like(entity.name, `%${q}%`));
  }
  return db
    .select({ id: entity.id, name: entity.name })
    .from(entity)
    .leftJoin(userGuess, eq(userGuess.entityId, entity.id))
    .leftJoin(game, eq(game.id, userGuess.gameId))
    .where(condition)
    .orderBy(asc(entity.name))
    .limit(20);
};

export { searchArtist };
