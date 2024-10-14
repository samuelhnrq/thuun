import type {
  EntityWithProps,
  GuessAnswer,
  NumericalPropComparison,
  PropComparison,
  PropWithValue,
} from "~/lib/models";
import type { EntityPropKind, entityPropValue } from "./db/schema";
import * as R from "ramda";

type Prop = typeof entityPropValue.$inferSelect;

export interface PropValue extends Prop {
  propName: string;
  propKind: EntityPropKind;
}

const COMPARISON_FUNCTIONS: Record<
  EntityPropKind,
  (a: PropValue, b: PropValue) => PropComparison
> = {
  NUMERICAL: compareNumericalProp,
  CATEGORICAL: compareCategoricalProp,
  CHRONOLOGICAL: compareCategoricalProp,
  GEOGRAPHICAL: compareCategoricalProp,
};

function compareNumericalProp(
  guess: PropValue,
  answer: PropValue,
): NumericalPropComparison {
  if (guess.value === answer.value) {
    return {
      kind: "NUMERICAL",
      correct: true,
      propId: guess.id,
      value: guess.value,
      name: guess.propName,
      difference: 0,
    };
  }
  if (guess.value > answer.value) {
    return {
      kind: "NUMERICAL",
      correct: false,
      propId: guess.id,
      value: guess.value,
      name: guess.propName,
      difference: 1,
    };
  }
  return {
    propId: guess.id,
    value: guess.value,
    kind: "NUMERICAL",
    correct: false,
    name: guess.propName,
    difference: -1,
  };
}

function compareCategoricalProp(
  guess: PropValue,
  answer: PropValue,
): PropComparison {
  if (guess.value === answer.value) {
    return {
      kind: guess.propKind,
      propId: guess.id,
      correct: true,
      name: guess.propName,
      value: guess.value,
    };
  }
  return {
    propId: guess.id,
    value: guess.value,
    kind: "CATEGORICAL",
    correct: false,
    name: guess.propName,
  };
}

function compareProp(
  guess: PropWithValue,
  answer: PropWithValue,
): PropComparison {
  if (guess.id !== answer.id) {
    throw new Error("Props not equal");
  }
  return COMPARISON_FUNCTIONS[guess.propKind](guess, answer);
}

export function compareEntities(
  answer: EntityWithProps,
  userGuess: EntityWithProps,
): GuessAnswer {
  const guess = userGuess;
  const propSorter = R.sortBy(R.prop("propId"));
  const guessProps = propSorter(guess.props);
  const answerProps = propSorter(answer.props);
  const comparisions = R.zipWith(compareProp, guessProps, answerProps);
  return {
    id: userGuess.id.toString(),
    artist: guess,
    correct: R.all<PropComparison>(R.prop("correct"), comparisions),
    comparisions,
  };
}
