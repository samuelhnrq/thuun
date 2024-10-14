import "server-only";

import { wrap } from "@typeschema/valibot";
import { and, asc, eq, isNull } from "drizzle-orm";
import { string } from "valibot";
import type { ArtistSearchResult } from "~/lib/models";
import { entity, userGuess } from "~/server/db/schema";
import { privateProcedure } from "../utils";

export default privateProcedure
  .input(wrap(string()))
  .query(({ input, ctx: { session, db } }): Promise<ArtistSearchResult[]> => {
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
      .where(
        and(isNull(userGuess.id), eq(userGuess.userId, session.user.email)),
      )
      .orderBy(asc(entity.name))
      .limit(20);
  });
