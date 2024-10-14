import "server-only";

import type {
  EntityWithProps,
  GuessAnswer,
  NumericalPropComparison,
  PropComparison,
  PropWithValue,
} from "~/lib/models";
import type { EntityPropKind } from "./db/schema";
import S from "sanctuary";

const COMPARISON_FUNCTIONS: Record<
  EntityPropKind,
  (a: PropWithValue, b: PropWithValue) => PropComparison
> = {
  NUMERICAL: compareNumericalProp,
  CATEGORICAL: compareCategoricalProp,
  CHRONOLOGICAL: compareCategoricalProp,
  GEOGRAPHICAL: compareCategoricalProp,
};

function compareNumericalProp(
  guess: PropWithValue,
  answer: PropWithValue,
): NumericalPropComparison {
  if (guess.value === answer.value) {
    return {
      kind: "NUMERICAL",
      correct: true,
      propId: guess.id,
      value: guess.value,
      name: guess.name,
      difference: 0,
    };
  }
  if (guess.value > answer.value) {
    return {
      kind: "NUMERICAL",
      correct: false,
      propId: guess.id,
      value: guess.value,
      name: guess.name,
      difference: 1,
    };
  }
  return {
    propId: guess.id,
    value: guess.value,
    kind: "NUMERICAL",
    correct: false,
    name: guess.name,
    difference: -1,
  };
}

function compareCategoricalProp(
  guess: PropWithValue,
  answer: PropWithValue,
): PropComparison {
  if (guess.value === answer.value) {
    return {
      kind: guess.propKind,
      propId: guess.id,
      correct: true,
      name: guess.name,
      value: guess.value,
    };
  }
  return {
    propId: guess.id,
    value: guess.value,
    kind: "CATEGORICAL",
    correct: false,
    name: guess.name,
  };
}

const compareProp = S.curry2(
  (guess: PropWithValue, answer: PropWithValue): PropComparison => {
    if (guess.id !== answer.id) {
      throw new Error("Props not equal");
    }
    return COMPARISON_FUNCTIONS[guess.propKind](guess, answer);
  },
);

export function compareEntities(
  answer: EntityWithProps,
  guess: EntityWithProps,
): Readonly<GuessAnswer> {
  const propSorter = S.sortBy<PropWithValue>(S.prop("propId"));
  const guessProps = propSorter(guess.props);
  const answerProps = propSorter(answer.props);
  const comparisions = S.zipWith(compareProp)(guessProps)(answerProps);
  return {
    id: guess.id.toString(),
    artist: guess,
    correct: S.all(S.prop("correct"))(comparisions),
    comparisions,
  };
}
