import type {
  entity,
  dailyEntity,
  EntityPropKind,
  entityProp,
} from "~/server/db/schema";

export interface GuessesState {
  guesses: GuessAnswer[];
  hasCorrectGuess: boolean;
  loading: boolean;
  date: number;
}

type Entity = typeof entity.$inferSelect;
type DailyEntry = typeof dailyEntity.$inferSelect;
type EntityProp = typeof entityProp.$inferSelect;

export interface DailyEntryWithEntity extends DailyEntry {
  entity: EntityWithProps;
}

export interface PropWithValue extends EntityProp {
  kind: EntityPropKind;
  value: string;
}

export interface EntityWithProps extends Entity {
  props: PropWithValue[];
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
  comparisions: PropComparison[];
}

export interface ArtistSearchResult {
  name: string;
  id: number;
}
