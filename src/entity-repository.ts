import { eq, and } from "drizzle-orm";
import type {
  DailyEntryWithEntity,
  Entity,
  EntityProp,
  EntityPropValue,
  EntityWithProps,
  PropWithValue,
} from "./lib/models";
import { db } from "./server/database";
import {
  dailyEntity,
  entity,
  entityProp,
  entityPropValue as propValue,
  userGuess,
} from "./server/db/schema";

interface JoinedResult {
  entity: Entity;
  entityPropValue: EntityPropValue;
  entityProp: EntityProp;
}

function toPropWithValue(entry: JoinedResult): PropWithValue {
  return {
    ...entry.entityProp,
    kind: entry.entityProp.propKind,
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
        }
        acc[entry.entity.id] = {
          ...entry.entity,
          props: [toPropWithValue(entry)],
        };
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
    .innerJoin(dailyEntity, eq(userGuess.dailyEntityId, dailyEntity.entityId))
    .innerJoin(entityProp, eq(propValue.propId, entityProp.id))
    .innerJoin(propValue, eq(dailyEntity.entityId, propValue.entityId))
    .innerJoin(entity, eq(dailyEntity.entityId, entity.id))
    .where(and(eq(dailyEntity.day, date), eq(userGuess.userId, email)))
    .orderBy(userGuess.createdAt)
    .limit(10);
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
    .innerJoin(entityProp, eq(entity.id, propValue.propId))
    .where(eq(dailyEntity.day, date))
    .limit(1);
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
  return { ...entries[0].dailyEntity, entity: aggregated[0] };
}
