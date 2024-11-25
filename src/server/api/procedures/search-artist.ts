"use server";

import { type SQL, and, asc, eq, isNull, like } from "drizzle-orm";
import { UnauthorizedError } from "~/lib/errors";
import type { EntitySearchResult } from "~/lib/models";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { entity, game, userGuess } from "~/server/db/schema";
import { logger } from "~/server/logger";

const searchArtist = async (
  q: string,
  gameKey?: string | null,
): Promise<EntitySearchResult[]> => {
  const session = await getSession();
  const email = session.user?.email;
  if (!email) {
    throw new UnauthorizedError();
  }
  logger.info("searching for artist '%s', in game '%s'", q, gameKey);
  let condition: SQL<unknown> | undefined = undefined;
  const base = db
    .selectDistinct({ id: entity.id, name: entity.name })
    .from(entity);
  if (gameKey) {
    base
      .innerJoin(game, eq(game.gameKey, gameKey))
      .leftJoin(
        userGuess,
        and(eq(game.id, userGuess.gameId), eq(entity.id, userGuess.entityId)),
      );
    condition = isNull(userGuess.id);
  }
  if (q.length >= 3) {
    condition = and(condition, like(entity.name, `%${q}%`));
  }
  const res = await base.where(condition).orderBy(asc(entity.name)).limit(20);
  return res;
};

export { searchArtist };
