import type {
  EntityPropKind,
  dailyEntity,
  entity,
  entityProp,
  entityPropValue,
} from "~/server/db/schema";

export interface GuessesState {
  guesses: GuessAnswer[];
  hasCorrectGuess: boolean;
  loading: boolean;
  date: number;
}

export type Entity = typeof entity.$inferSelect;
export type DailyEntry = typeof dailyEntity.$inferSelect;
export type EntityProp = typeof entityProp.$inferSelect;
export type EntityPropValue = typeof entityPropValue.$inferSelect;

export interface PropWithValue extends EntityProp {
  kind: EntityPropKind;
  value: string;
}

export interface EntityWithProps extends Entity {
  props: PropWithValue[];
}

export interface DailyEntryWithEntity extends DailyEntry {
  entity: EntityWithProps;
}

export interface NumericalPropComparison extends PropComparison {
  kind: "NUMERICAL";
  difference: -1 | 0 | 1;
}

export interface PropComparison {
  propId: number;
  name: string;
  value: string;
  kind: EntityPropKind;
  correct: boolean;
}

export interface GuessAnswer {
  id: string;
  artist: EntityWithProps;
  correct: boolean;
  comparisions: readonly PropComparison[];
}

export interface ArtistSearchResult {
  name: string;
  id: number;
}
