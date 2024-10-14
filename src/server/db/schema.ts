import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const entityKinds = ["ARTIST"] as const;

export const entity = sqliteTable("entity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityKind: text("entity_kind", { enum: entityKinds }).notNull(),
  name: text("name").notNull(),
  externalId: text("external_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(UNIXEPOCH())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(UNIXEPOCH())`),
});

const propKinds = [
  "CATEGORICAL",
  "NUMERICAL",
  "CHRONOLOGICAL",
  "GEOGRAPHICAL",
] as const;

export type EntityPropKind = (typeof propKinds)[number];

export const entityProp = sqliteTable("entity_prop", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  propKind: text("prop_kind", { enum: propKinds }).notNull(),
});

// pivot table
export const entityPropValue = sqliteTable("entity_prop_value", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityId: integer("entity_id")
    .notNull()
    .references(() => entity.id),
  propId: integer("prop_id")
    .notNull()
    .references(() => entityProp.id),
  value: text("value").notNull(),
});

export const dailyEntity = sqliteTable("daily_entity", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  day: integer("day", { mode: "timestamp" }).unique().notNull(),
  entityId: integer("entity_id")
    .notNull()
    .references(() => entity.id, { onDelete: "cascade" }),
});

export const userGuess = sqliteTable("user_guess", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  entityId: integer("entity_id")
    .notNull()
    .references(() => entity.id),
  dailyEntityId: integer("daily_entity_id")
    .notNull()
    .references(() => dailyEntity.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(UNIXEPOCH())`),
});
