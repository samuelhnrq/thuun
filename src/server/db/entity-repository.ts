import { and, eq } from "drizzle-orm";
import type { DailyEntryWithEntity, EntityWithProps } from "../../lib/models";
import { aggregateEntityProps } from "../comparator";
import { ConflictError, NotFoundError } from "../lib/errors";
import { logger } from "../logger";
import { db } from "./client";
import {
  dailyEntity,
  entity,
  entityProp,
  entityPropValue as propValue,
  userGuess,
} from "./schema";

export async function findGuessedEntitiesForDay(
  date: Date,
  email: string,
): Promise<EntityWithProps[]> {
  const guesses = await db
    .select({
      entity,
      entityPropValue: propValue,
      entityProp,
      guessedAt: userGuess.createdAt,
    })
    .from(userGuess)
    .innerJoin(dailyEntity, eq(dailyEntity.id, userGuess.dailyEntityId))
    .innerJoin(entity, eq(entity.id, userGuess.entityId))
    .innerJoin(propValue, eq(propValue.entityId, entity.id))
    .innerJoin(entityProp, eq(entityProp.id, propValue.propId))
    .where(and(eq(dailyEntity.day, date), eq(userGuess.userId, email)))
    .orderBy(userGuess.createdAt);
  return aggregateEntityProps(guesses);
}

const dailyArtistCache = new Map<string, DailyEntryWithEntity>();

export async function findDailyEntryForDay(
  date: Date,
): Promise<DailyEntryWithEntity | null> {
  const cacheKey = date.toISOString();
  const cached = dailyArtistCache.get(cacheKey);
  if (cached) {
    logger.debug("Found cached artist for %s", cacheKey);
    return cached;
  }
  const entries = await db
    .select({
      dailyEntity,
      entity,
      entityPropValue: propValue,
      entityProp,
      guessedAt: entity.createdAt,
    })
    .from(dailyEntity)
    .innerJoin(entity, eq(dailyEntity.entityId, entity.id))
    .innerJoin(propValue, eq(entity.id, propValue.entityId))
    .innerJoin(entityProp, eq(entityProp.id, propValue.propId))
    .where(eq(dailyEntity.day, date));
  if (entries.length === 0) {
    return null;
  }
  const aggregated = aggregateEntityProps(entries);

  if (aggregated.length === 0) {
    throw new NotFoundError("No entities found");
  }
  if (aggregated.length > 1) {
    throw new ConflictError("More than one entity found");
  }
  logger.info("Fetched artist of the day", aggregated[0].name);
  const entry = { ...entries[0].dailyEntity, entity: aggregated[0] };
  dailyArtistCache.set(cacheKey, entry);
  return entry;
}
