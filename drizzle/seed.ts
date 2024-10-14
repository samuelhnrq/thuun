import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { entity, entityProp, entityPropValue } from "../src/server/db/schema";

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not set");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

console.log("connecting to db, seeding");
await db.insert(entity).values([
  { id: 1, name: "Lady Gaga", externalId: "1", entityKind: "ARTIST" },
  { id: 2, name: "Madonna", externalId: "2", entityKind: "ARTIST" },
  { id: 3, name: "The Beatles", externalId: "3", entityKind: "ARTIST" },
  { id: 4, name: "The Rolling Stones", externalId: "4", entityKind: "ARTIST" },
  { id: 5, name: "Pink Floyd", externalId: "5", entityKind: "ARTIST" },
  { id: 6, name: "Queen", externalId: "6", entityKind: "ARTIST" },
  { id: 7, name: "Michael Jackson", externalId: "7", entityKind: "ARTIST" },
  { id: 8, name: "Elvis Presley", externalId: "8", entityKind: "ARTIST" },
  { id: 9, name: "John Lennon", externalId: "9", entityKind: "ARTIST" },
]);

await db.insert(entityProp).values([
  { id: 1, name: "Popularity", propKind: "NUMERICAL" },
  { id: 2, name: "Country", propKind: "GEOGRAPHICAL" },
  { id: 3, name: "Genre", propKind: "CATEGORICAL" },
  { id: 4, name: "Gender", propKind: "CATEGORICAL" },
  { id: 5, name: "Debut Album", propKind: "CHRONOLOGICAL" },
]);

await db.insert(entityPropValue).values([
  // Lady Gaga
  { entityId: 1, propId: 1, value: "1" },
  { entityId: 1, propId: 2, value: "United States" },
  { entityId: 1, propId: 3, value: "Pop" },
  { entityId: 1, propId: 4, value: "Female" },
  { entityId: 1, propId: 5, value: "2000" },
  // Madonna
  { entityId: 2, propId: 1, value: "2" },
  { entityId: 2, propId: 2, value: "United States" },
  { entityId: 2, propId: 3, value: "Pop" },
  { entityId: 2, propId: 4, value: "Female" },
  { entityId: 2, propId: 5, value: "1969" },
  // The Beatles
  { entityId: 3, propId: 1, value: "3" },
  { entityId: 3, propId: 2, value: "United Kingdom" },
  { entityId: 3, propId: 3, value: "Pop" },
  { entityId: 3, propId: 4, value: "Male" },
  { entityId: 3, propId: 5, value: "1960" },
  // The Rolling Stones
  { entityId: 4, propId: 1, value: "4" },
  { entityId: 4, propId: 2, value: "United Kingdom" },
  { entityId: 4, propId: 3, value: "Rock" },
  { entityId: 4, propId: 4, value: "Male" },
  { entityId: 4, propId: 5, value: "1964" },
  // Pink Floyd
  { entityId: 5, propId: 1, value: "5" },
  { entityId: 5, propId: 2, value: "United Kingdom" },
  { entityId: 5, propId: 3, value: "Rock" },
  { entityId: 5, propId: 4, value: "Male" },
  { entityId: 5, propId: 5, value: "1965" },
  // Queen
  { entityId: 6, propId: 1, value: "6" },
  { entityId: 6, propId: 2, value: "United Kingdom" },
  { entityId: 6, propId: 3, value: "Rock" },
  { entityId: 6, propId: 4, value: "Male" },
  { entityId: 6, propId: 5, value: "1976" },
  // Michael Jackson
  { entityId: 7, propId: 1, value: "7" },
  { entityId: 7, propId: 2, value: "United States" },
  { entityId: 7, propId: 3, value: "Pop" },
  { entityId: 7, propId: 4, value: "Male" },
  { entityId: 7, propId: 5, value: "1958" },
  // Elvis Presley
  { entityId: 8, propId: 1, value: "8" },
  { entityId: 8, propId: 2, value: "United States" },
  { entityId: 8, propId: 3, value: "Rock" },
  { entityId: 8, propId: 4, value: "Male" },
  { entityId: 8, propId: 5, value: "1956" },
  // John Lennon
  { entityId: 9, propId: 1, value: "9" },
  { entityId: 9, propId: 2, value: "United Kingdom" },
  { entityId: 9, propId: 3, value: "Rock" },
  { entityId: 9, propId: 4, value: "Male" },
  { entityId: 9, propId: 5, value: "1940" },
]);

console.log("seeded");
