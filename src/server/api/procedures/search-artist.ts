"use server";

import { and, asc, eq, isNull, like } from "drizzle-orm";
import type { ArtistSearchResult } from "~/lib/models";
import { getSession } from "~/server/auth";
import { db } from "~/server/db/client";
import { entity, userGuess } from "~/server/db/schema";

const searchArtist = async (input: string): Promise<ArtistSearchResult[]> => {
  const session = await getSession();
  if (input.length < 3 || !session.user?.email) {
    return db
      .select({ id: entity.id, name: entity.name })
      .from(entity)
      .orderBy(asc(entity.name))
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
