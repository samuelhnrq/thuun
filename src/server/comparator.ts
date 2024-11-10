import { Array as Arr, Order, pipe } from "effect";
import type {
  EntityWithProps,
  GuessAnswer,
  JoinedResult,
  NumericalPropComparison,
  PropComparison,
  PropWithValue,
} from "~/lib/models";
import { ThuunError } from "../lib/errors";
import type { EntityPropKind } from "./db/schema";

function toPropWithValue(entry: JoinedResult): PropWithValue {
  return {
    ...entry.entityProp,
    value: entry.entityPropValue.value,
  };
}

function collapseResults([head, ...rest]: JoinedResult[]): EntityWithProps {
  const initial: EntityWithProps = {
    ...head.entity,
    guessedAt: head.guessedAt,
    props: [toPropWithValue(head)],
  };
  return Arr.reduce(rest, initial, (acc, next) => {
    acc.props.push(toPropWithValue(next));
    return acc;
  });
}

export function aggregateEntityProps(
  entries: JoinedResult[],
): EntityWithProps[] {
  return pipe(
    entries,
    Arr.groupBy((x) => x.entity.id.toString()),
    Object.values,
    Arr.map(collapseResults),
    Arr.sortWith((x) => x.guessedAt, Order.reverse(Order.Date)),
  );
}

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
  const guessValue = Number.parseInt(guess.value);
  const answerValue = Number.parseInt(answer.value);
  if (guessValue === answerValue) {
    return {
      kind: "NUMERICAL",
      correct: true,
      propId: guess.id,
      value: guess.value,
      name: guess.name,
      difference: 0,
    };
  }
  if (guessValue > answerValue) {
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
    kind: guess.propKind,
    correct: false,
    name: guess.name,
  };
}

function compareProp(
  guess: PropWithValue,
  answer: PropWithValue,
): PropComparison {
  if (guess.id !== answer.id) {
    throw new ThuunError("Props not equal");
  }
  return COMPARISON_FUNCTIONS[guess.propKind](guess, answer);
}

export function compareEntities(
  answer: EntityWithProps,
  guess: EntityWithProps,
): GuessAnswer {
  const comparisions = pipe(
    Arr.appendAll(guess.props, answer.props),
    Arr.groupBy((x) => x.id.toString()),
    Object.values,
    Arr.map(([x, y]) => compareProp(x, y)),
  );
  const result: GuessAnswer = {
    id: guess.id.toString(),
    artist: guess,
    correct: guess.id === answer.id,
    comparisions,
  };
  return result;
}
