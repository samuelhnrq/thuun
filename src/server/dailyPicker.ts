import "server-only";

import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { dailyEntity, entity, entityPropValue } from "./db/schema";
import { count, eq, sql } from "drizzle-orm";
import type { DailyEntryWithEntity } from "~/lib/models";
import { logger } from "./logger";
import { db } from "./database";

type DailyEntry = typeof dailyEntity.$inferSelect;
type Entity = typeof entity.$inferSelect;
type EntityPropValue = typeof entityPropValue.$inferSelect;

interface JoinedResult {
  dailyEntity: DailyEntry;
  entity: Entity;
  entityPropValue: EntityPropValue;
}

function aggregateDailyEntries(
  entries: JoinedResult[],
): DailyEntryWithEntity[] {
  return Object.values(
    entries.reduce(
      (acc, entry) => {
        const existing = acc[entry.dailyEntity.id];
        if (existing) {
          existing.entity.props.push(entry.entityPropValue);
        }
        acc[entry.dailyEntity.id] = {
          entity: {
            ...entry.entity,
            props: [entry.entityPropValue],
          },
          ...entry.dailyEntity,
        };
        return acc;
      },
      {} as Record<number, DailyEntryWithEntity>,
    ),
  );
}

function getToday() {
  return dayjs().startOf("day").toDate();
}

async function getDailyEntries(): Promise<DailyEntryWithEntity[]> {
  const day = getToday();
  const todays = await db
    .select({ dailyEntity, entity, entityPropValue })
    .from(dailyEntity)
    .innerJoin(entity, eq(dailyEntity.entityId, entity.id))
    .innerJoin(entityPropValue, eq(entity.id, entityPropValue.entityId))
    .where(eq(dailyEntity.day, day))
    .limit(1);
  return aggregateDailyEntries(todays);
}

export async function getTodayArtist(): Promise<DailyEntryWithEntity> {
  const [today] = await getDailyEntries();
  if (today) {
    return today;
  }
  const [{ totalEntities }] = await db
    .select({ totalEntities: count(dailyEntity.id) })
    .from(dailyEntity);
  if (totalEntities === 0) {
    logger.error("Database is empty");
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  logger.info("No artist for today, running dice");
  let randomArtist: Entity | null = null;
  while (!randomArtist) {
    const [nextArtist] = await db
      .select()
      .from(entity)
      .orderBy(sql`RANDOM()`)
      .limit(1);
    if (nextArtist) {
      randomArtist = nextArtist;
    }
  }
  logger.info("Picked", randomArtist.name);
  const day = getToday();
  await db.insert(dailyEntity).values({
    day,
    entityId: randomArtist.id,
  });
  const [newToday] = await getDailyEntries();
  return newToday;
}
