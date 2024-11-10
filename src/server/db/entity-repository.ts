import Locker from "async-lock";
import { and, eq } from "drizzle-orm";
import { LRUCache } from "lru-cache";
import type { Entity, EntityWithProps, GameWithAnswer } from "~/lib/models";
import { getCurrentDate } from "~/lib/utils";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { aggregateEntityProps } from "../comparator";
import { logger } from "../logger";
import { db } from "./client";
import {
  entity,
  entityProp,
  game,
  entityPropValue as propValue,
  userGuess,
} from "./schema";

const dailyArtistCache = new LRUCache<string, GameWithAnswer>({
  max: 1000,
  ttl: 24 * 60 * 60 * 1000,
  updateAgeOnGet: true,
});
const locker = new Locker();

export async function createDailyEntry(): Promise<void> {
  const today = getCurrentDate().toISOString();
  await locker.acquire(today, async () => {
    await syncedCreateDailyEntry(today);
  });
}

async function syncedCreateDailyEntry(today: string): Promise<void> {
  const existingGame = await db.$count(game, eq(game.gameKey, today));
  if (existingGame > 0) {
    logger.info("Game already exists for today");
    return;
  }
  const totalEntities = await db.$count(entity);
  if (totalEntities === 0) {
    logger.error("Database is empty");
    throw new NotFoundError();
  }
  logger.info("No daily game for %s, running dice", today);
  let randomArtist: Entity | null = null;
  while (!randomArtist) {
    const randomId = Math.floor(Math.random() * totalEntities) + 1;
    const [nextArtist] = await db
      .select()
      .from(entity)
      .where(eq(entity.id, randomId))
      .limit(1);
    if (nextArtist) {
      randomArtist = nextArtist;
    }
  }
  logger.info("Picked", randomArtist.name);
  await db.insert(game).values({
    gameKey: today,
    answerId: randomArtist.id,
  });
}

export async function findAlreadyGuessed(
  gameKey: string,
  userEmail: string,
): Promise<EntityWithProps[]> {
  return locker.acquire(gameKey, async () => {
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
  });
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
