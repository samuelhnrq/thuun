import type {
  EntityPropKind,
  game,
  entity,
  entityProp,
  entityPropValue,
  userGuess,
} from "~/server/db/schema";

export interface GuessesState {
  guesses: GuessAnswer[];
  hasCorrectGuess: boolean;
  loading: boolean;
  date: number;
}

export type Entity = typeof entity.$inferSelect;
export type Game = typeof game.$inferSelect;
export type EntityProp = typeof entityProp.$inferSelect;
export type EntityPropValue = typeof entityPropValue.$inferSelect;
export type UserGuess = typeof userGuess.$inferSelect;

export interface JoinedResult {
  entity: Entity;
  entityPropValue: EntityPropValue;
  entityProp: EntityProp;
  guessedAt: Date;
}

export interface PropWithValue extends EntityProp {
  value: string;
}

export interface EntityWithProps extends Entity {
  props: PropWithValue[];
  guessedAt: Date;
}

export interface GameWithAnswer extends Game {
  answer: EntityWithProps;
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
