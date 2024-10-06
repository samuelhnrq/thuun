import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const entityKind = sqliteTable("entity_kind", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
});

const EntityPropType = [
  "CATEGORICAL",
  "NUMERICAL",
  "CHRONOLOGICAL",
  "GEOGRAPHICAL",
] as const;

export const entityProp = sqliteTable("entity_prop", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name", { enum: EntityPropType }).notNull(),
  kind: integer("kind")
    .notNull()
    .references(() => entityKind.id),
});

export const entity = sqliteTable("entity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: integer("kind")
    .notNull()
    .references(() => entityKind.id),
  name: text("name").notNull(),
  externalId: text("external_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`UNIXEPOCH()`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`UNIXEPOCH()`),
});

export const entityPropValue = sqliteTable("entity_prop_value", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entity: integer("entity")
    .notNull()
    .references(() => entity.id),
  prop: integer("prop")
    .notNull()
    .references(() => entityProp.id),
  value: text("value").notNull(),
});

export const dailyEntity = sqliteTable("daily_etity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  day: integer("day", { mode: "timestamp" }).notNull(),
  entity: integer("entity")
    .notNull()
    .references(() => entity.id),
});

export const userGuess = sqliteTable("user_guess", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  day: integer("day")
    .notNull()
    .references(() => dailyEntity.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`UNIXEPOCH()`),
});
