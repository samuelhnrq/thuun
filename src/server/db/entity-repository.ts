import { and, eq } from "drizzle-orm";
import type { EntityWithProps, GameWithAnswer } from "~/lib/models";
import { getCurrentDate } from "~/lib/utils";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { aggregateEntityProps } from "../comparator";
import { logger } from "../logger";
import { CachedResource } from "../synced-cache";
import { db } from "./client";
import {
  entity,
  entityProp,
  game,
  entityPropValue as propValue,
  userGuess,
} from "./schema";

class CachedGame extends CachedResource<GameWithAnswer> {
  async cacheValueMiss(gameKey: string): Promise<GameWithAnswer | null> {
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
    const entry = { ...entries[0].game, answer: aggregated[0] };
    return entry;
  }

  async createEntry(
    gameKey: string,
    getAnswer: () => Promise<number> | number,
    author = "thuun@daily.com",
  ): Promise<void> {
    this.locker.acquire(gameKey, async () => {
      logger.debug("lock acquired for %s", gameKey);
      logger.info("generating answer for %s", gameKey);
      const answer = await getAnswer();
      logger.info("Creating game %s with answer %s", gameKey, answer);
      await db.insert(game).values({
        gameKey: gameKey,
        author: author,
        answerId: answer,
      });
      logger.info("Created game for %s", gameKey);
      this.dailyArtistCache.delete(gameKey);
    });
  }
}
export const dailyArtistCache = new CachedGame();

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
  return dailyArtistCache.get(gameKey);
}

export async function createDailyEntry(): Promise<void> {
  const today = getCurrentDate().toISOString();
  if (await dailyArtistCache.has(today)) {
    logger.debug("entity in cache, must exist");
    return;
  }
  const existingGame = await db.$count(game, eq(game.gameKey, today));
  if (existingGame > 0) {
    logger.debug("Game already exists for today, warming cache");
    await dailyArtistCache.get(today);
    return;
  }
  const totalEntities = await db.$count(entity);
  if (totalEntities === 0) {
    logger.error("Database is empty");
    throw new NotFoundError();
  }
  const randomArtistPicker = async () => {
    logger.info("No daily game for %s, running dice", today);
    while (true) {
      const randomId = Math.floor(Math.random() * totalEntities) + 1;
      const [artist] = await db
        .select()
        .from(entity)
        .where(eq(entity.id, randomId))
        .limit(1);
      if (artist) {
        logger.info("Picked", artist.name);
        return artist.id;
      }
    }
  };
  await dailyArtistCache.createEntry(today, randomArtistPicker);
}

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
