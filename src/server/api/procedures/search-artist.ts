"use server";

import { and, asc, eq, isNull, like, ne, or } from "drizzle-orm";
import type { ArtistSearchResult } from "~/lib/models";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { game, entity, userGuess } from "~/server/db/schema";
import { UnauthorizedError } from "~/lib/errors";
import { getGameForKey } from "~/server/db/entity-repository";

const searchArtist = async (
  q: string,
  gameKey: string,
): Promise<ArtistSearchResult[]> => {
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
