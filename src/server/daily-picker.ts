import { count, eq } from "drizzle-orm";
import type { GameWithAnswer, Entity } from "~/lib/models";
import { findGameForKey } from "~/server/db/entity-repository";
import { db } from "./db/client";
import { game, entity } from "./db/schema";
import { NotFoundError } from "../lib/errors";
import { logger } from "./logger";
import { getCurrentDate } from "~/lib/utils";

// Move this to repository maybe?
async function createDailyEntry(): Promise<void> {
  const [{ totalEntities }] = await db
    .select({ totalEntities: count(entity.id) })
    .from(entity);
  if (totalEntities === 0) {
    logger.error("Database is empty");
    throw new NotFoundError();
  }
  logger.info("No artist for today, running dice");
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
  const day = getCurrentDate();
  await db.insert(game).values({
    gameKey: day.toISOString(),
    answerId: randomArtist.id,
  });
}

/**
 * touch as in unix touch, meaning: create a new entry for `inDate` if it doesn't
 * exist, otherwise return the existing entry for `inDate`
 *
 * @param inDate date to get the artist for, if not provided, today is used
 * @returns the artist for the given date
 */
export async function touchTodayGame(): Promise<GameWithAnswer> {
  const date = getCurrentDate().toISOString();
  const today = await findGameForKey(date);
  if (today) {
    return today;
  }
  await createDailyEntry();
  const newToday = await findGameForKey(date);
  if (!newToday) {
    throw new NotFoundError();
  }
  return newToday;
}
