import { beforeEach, expect, it } from "bun:test";
import type {
  EntityProp,
  EntityWithProps,
  JoinedResult,
  NumericalPropComparison,
} from "~/lib/models";
import { aggregateEntityProps, compareEntities } from "./comparator";

let counter = 1;

beforeEach(() => {
  counter = 1;
});

function baseArtist(name: string): EntityWithProps {
  return {
    id: counter++,
    name,
    entityKind: "ARTIST" as const,
    externalId: "music-artist-1",
    guessedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    props: [
      {
        id: 1,
        name: "Genre",
        propKind: "CATEGORICAL" as const,
        value: "Rock",
      },
      {
        id: 2,
        name: "Country",
        propKind: "CATEGORICAL" as const,
        value: "United States",
      },
      {
        id: 3,
        name: "Members",
        propKind: "NUMERICAL" as const,
        value: "3",
      },
    ],
  };
}

it("should compare two identical artists", () => {
  const artist = baseArtist("The Beatles");
  const result = compareEntities(artist, artist);
  expect(result.correct).toBe(true);
});

it("checks the id of the artist", () => {
  const artist = baseArtist("The Beatles");
  const other = baseArtist("The Beatles");
  const result = compareEntities(artist, other);
  expect(result.correct).toBe(false);
});

it("should compare two artists with different prop values", () => {
  const artist = baseArtist("The Beatles");
  const other = baseArtist("Lady Gaga");
  other.props[0].value = "Pop";
  const result = compareEntities(artist, other);
  expect(result.correct).toBe(false);
  expect(result.comparisions[0].correct).toBe(false);
});

it.each([-1, 0, 1] as const)(
  "should compare NUMERICAL prop values when its %p",
  (expected) => {
    const artist = baseArtist("The Beatles");
    const other = baseArtist("Lady Gaga");
    other.props[2].value = `${3 + 5 * expected}`;
    const result = compareEntities(artist, other);
    expect(result.comparisions[2].correct).toBe(expected === 0);
    expect(result.comparisions[2].kind).toBe("NUMERICAL");
    const numericalComparison = result
      .comparisions[2] as NumericalPropComparison;
    expect(numericalComparison.difference).toBe(expected);
  },
);

it("Orders the props by id", () => {
  const artist = baseArtist("The Beatles");
  const other = baseArtist("Lady Gaga");
  other.id = artist.id;
  other.props.reverse();
  const result = compareEntities(artist, other);
  expect(result.correct).toBe(true);
});

function simulateJoinedResult(
  entity: EntityWithProps,
  prop: EntityProp,
): JoinedResult {
  return {
    entity,
    entityPropValue: {
      id: 1,
      entityId: entity.id,
      propId: prop.id,
      value: "1",
    },
    entityProp: prop,
    guessedAt: new Date(),
  };
}

it("should aggregate props", () => {
  const artist = baseArtist("The Beatles");
  const joinedResult: JoinedResult[] = [];
  joinedResult.push(simulateJoinedResult(artist, artist.props[0]));
  joinedResult.push(simulateJoinedResult(artist, artist.props[1]));
  joinedResult.push(simulateJoinedResult(artist, artist.props[2]));
  const result = aggregateEntityProps(joinedResult);
  expect(result.length).toBe(1);
  expect(result[0].props.length).toBe(3);
});
