import { and, eq } from "drizzle-orm";
import { LRUCache } from "lru-cache";
import type { GameWithAnswer, EntityWithProps } from "~/lib/models";
import { aggregateEntityProps } from "../comparator";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { logger } from "../logger";
import { db } from "./client";
import {
  entity,
  entityProp,
  game,
  entityPropValue as propValue,
  userGuess,
} from "./schema";
import Locker from "async-lock";

const dailyArtistCache = new LRUCache<string, GameWithAnswer>({
  max: 1000,
  ttl: 24 * 60 * 60 * 1000,
  updateAgeOnGet: true,
});
const locker = new Locker();

export async function findAlreadyGuessed(
  gameKey: string,
  userEmail: string,
): Promise<EntityWithProps[]> {
  const guesses = await db
    .select({
      entity,
      entityPropValue: propValue,
      entityProp,
      guessedAt: userGuess.createdAt,
    })
    .from(userGuess)
    .innerJoin(game, eq(game.id, userGuess.gameId))
    .innerJoin(entity, eq(entity.id, userGuess.entityId))
    .innerJoin(propValue, eq(propValue.entityId, entity.id))
    .innerJoin(entityProp, eq(entityProp.id, propValue.propId))
    .where(and(eq(game.gameKey, gameKey), eq(userGuess.userId, userEmail)))
    .orderBy(userGuess.createdAt);
  return aggregateEntityProps(guesses);
}

export async function getGameForKey(gameKey: string): Promise<GameWithAnswer> {
  const game = await findGameForKey(gameKey);
  if (!game) {
    throw new NotFoundError("Game not found");
  }
  return game;
}

export async function findGameForKey(
  gameKey: string,
): Promise<GameWithAnswer | null> {
  return locker.acquire(gameKey, () => syncedFindGameForKey(gameKey));
}

async function syncedFindGameForKey(
  gameKey: string,
): Promise<GameWithAnswer | null> {
  logger.info("lock acquired");
  const cached = dailyArtistCache.get(gameKey);
  if (cached) {
    logger.debug("Found cached game for key '%s'", gameKey);
    return cached;
  }
  logger.debug("Game cache miss for key '%s'", gameKey);
  const entries = await db
    .select({
      game,
      entity,
      entityPropValue: propValue,
      entityProp,
      guessedAt: entity.createdAt,
    })
    .from(game)
    .innerJoin(entity, eq(game.answerId, entity.id))
    .innerJoin(propValue, eq(entity.id, propValue.entityId))
    .innerJoin(entityProp, eq(entityProp.id, propValue.propId))
    .where(eq(game.gameKey, gameKey));
  if (entries.length === 0) {
    return null;
  }
  const aggregated = aggregateEntityProps(entries);
  if (aggregated.length === 0) {
    throw new NotFoundError("Game with no answer");
  }
  if (aggregated.length > 1) {
    throw new ConflictError("Game with multiple answers");
  }
  logger.info("Fetched game for key '%s', caching", gameKey);
  const entry = { ...entries[0].game, answer: aggregated[0] };
  dailyArtistCache.set(gameKey, entry);
  return entry;
}
