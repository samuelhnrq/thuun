"use server";

import { and, asc, eq, isNull, like, ne, or } from "drizzle-orm";
import type { ArtistSearchResult } from "~/lib/models";
import { getSession } from "~/server/auth";
import { getCurrentDate } from "~/server/daily-picker";
import { db } from "~/server/db/client";
import { dailyEntity, entity, userGuess } from "~/server/db/schema";
import { UnauthorizedError } from "~/server/lib/errors";

const searchArtist = async (input: string): Promise<ArtistSearchResult[]> => {
  const session = await getSession();
  const email = session.user?.email;
  if (!email) {
    throw new UnauthorizedError();
  }
  if (input.length < 3) {
    return db
      .select({ id: entity.id, name: entity.name })
      .from(entity)
      .orderBy(asc(entity.name))
      .leftJoin(userGuess, eq(userGuess.entityId, entity.id))
      .leftJoin(dailyEntity, eq(dailyEntity.id, userGuess.dailyEntityId))
      .where(or(isNull(userGuess.id), ne(dailyEntity.day, getCurrentDate())))
      .limit(20);
  }
  return db
    .select({ id: entity.id, name: entity.name })
    .from(entity)
    .leftJoin(userGuess, eq(userGuess.entityId, entity.id))
    .where(and(isNull(userGuess.id), like(entity.name, `%${input}%`)))
    .orderBy(asc(entity.name))
    .limit(20);
};

export { searchArtist };
