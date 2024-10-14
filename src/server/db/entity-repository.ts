import { and, eq } from "drizzle-orm";
import type {
  DailyEntryWithEntity,
  Entity,
  EntityProp,
  EntityPropValue,
  EntityWithProps,
  PropWithValue,
} from "../../lib/models";
import { logger } from "../logger";
import { db } from "./client";
import {
  dailyEntity,
  entity,
  entityProp,
  entityPropValue as propValue,
  userGuess,
} from "./schema";

interface JoinedResult {
  entity: Entity;
  entityPropValue: EntityPropValue;
  entityProp: EntityProp;
}

function toPropWithValue(entry: JoinedResult): PropWithValue {
  return {
    ...entry.entityProp,
    value: entry.entityPropValue.value,
  };
}

function aggregateEntityProps(entries: JoinedResult[]): EntityWithProps[] {
  return Object.values(
    entries.reduce(
      (acc, entry) => {
        const existing = acc[entry.entity.id];
        if (existing) {
          existing.props.push(toPropWithValue(entry));
        } else {
          acc[entry.entity.id] = {
            ...entry.entity,
            props: [toPropWithValue(entry)],
          };
        }
        return acc;
      },
      {} as Record<number, EntityWithProps>,
    ),
  );
}

export async function findGuessedEntitiesForDay(
  date: Date,
  email: string,
): Promise<EntityWithProps[]> {
  const guesses = await db
    .select({ entity, entityPropValue: propValue, entityProp })
    .from(userGuess)
    .innerJoin(dailyEntity, eq(dailyEntity.id, userGuess.dailyEntityId))
    .innerJoin(entity, eq(entity.id, userGuess.entityId))
    .innerJoin(propValue, eq(propValue.entityId, entity.id))
    .innerJoin(entityProp, eq(entityProp.id, propValue.propId))
    .where(and(eq(dailyEntity.day, date), eq(userGuess.userId, email)))
    .orderBy(userGuess.createdAt);
  return aggregateEntityProps(guesses);
}

export async function findDailyEntryForDay(
  date: Date,
): Promise<DailyEntryWithEntity | null> {
  const entries = await db
    .select({ dailyEntity, entity, entityPropValue: propValue, entityProp })
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
    throw new Error("No entities found");
  }
  if (aggregated.length > 1) {
    throw new Error("More than one entity found");
  }
  logger.info("Fetched artist of the day", aggregated[0].name);
  return { ...entries[0].dailyEntity, entity: aggregated[0] };
}
