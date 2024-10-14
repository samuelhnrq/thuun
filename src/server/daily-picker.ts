import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { count, eq } from "drizzle-orm";
import type { DailyEntryWithEntity, Entity } from "~/lib/models";
import { findDailyEntryForDay } from "~/server/db/entity-repository";
import { db } from "./db/client";
import { dailyEntity, entity } from "./db/schema";
import { logger } from "./logger";

export function getCurrentDate(input?: string): Date {
  let base = dayjs();
  if (input) {
    try {
      base = dayjs(input);
    } catch (err) {
      logger.error("failed to parse date", input, err);
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
  }
  return base.startOf("day").toDate();
}

// Move this to repository maybe?
async function createDailyEntry(): Promise<void> {
  const [{ totalEntities }] = await db
    .select({ totalEntities: count(entity.id) })
    .from(entity);
  if (totalEntities === 0) {
    logger.error("Database is empty");
    throw new TRPCError({ code: "NOT_FOUND" });
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
  await db.insert(dailyEntity).values({
    day,
    entityId: randomArtist.id,
  });
}

/**
 * touch as in unix touch, meaning: create a new entry for `inDate` if it doesn't
 * exist, otherwise return the existing entry for `inDate`
 *
 * @param inDate date to get the artist for, if not provided, today is used
 * @returns the artist for the given date
 */
export async function touchTodayArtist(
  inDate?: Date,
): Promise<DailyEntryWithEntity> {
  const date = inDate ?? getCurrentDate();
  const today = await findDailyEntryForDay(date);
  if (today) {
    return today;
  }
  await createDailyEntry();
  const newToday = await findDailyEntryForDay(date);
  if (!newToday) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  return newToday;
}
