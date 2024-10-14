import { expect, it } from "bun:test";
import type { EntityWithProps, NumericalPropComparison } from "~/lib/models";
import { compareEntities } from "./comparator";

function baseArtist(name: string): EntityWithProps {
  return {
    id: 1,
    name,
    entityKind: "ARTIST" as const,
    externalId: "music-artist-1",
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
  other.id = 2;
  const result = compareEntities(artist, other);
  expect(result.correct).toBe(false);
});

it("should compare two artists with different prop values", () => {
  const artist = baseArtist("The Beatles");
  const other = baseArtist("Lady Gaga");
  other.props[0].value = "Pop";
  const result = compareEntities(artist, other);
  expect(result.correct).toBe(false);
});

it.each([-1, 0, 1] as const)(
  "should compare NUMERICAL prop values when its %p",
  (expected) => {
    const artist = baseArtist("The Beatles");
    const other = baseArtist("Lady Gaga");
    other.props[2].value = `${3 + expected}`;
    const result = compareEntities(artist, other);
    expect(result.correct).toBe(expected === 0);
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
  other.props.reverse();
  const result = compareEntities(artist, other);
  expect(result.correct).toBe(true);
});
