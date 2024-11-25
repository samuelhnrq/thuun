import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { ErrorBoundary, Show, createMemo, from } from "solid-js";
import type { EntitySearchResult } from "~/lib/models";
import { gameKey$ } from "~/lib/state";
import { useListGuesses } from "~/lib/use-list-guesses";
import { guessArtist } from "~/server/api/procedures/guess-artist";
import { EntitySelector } from "./EntitySelector";

function SafeEntityGuesser() {
  const client = useQueryClient();
  const guessList = useListGuesses();
  const correctArtist = createMemo(() =>
    guessList.data?.find((x) => x.correct),
  );
  const answerFound = () =>
    (!!guessList.data && guessList.data?.length >= 10) || !!correctArtist();
  const getGameKey = from(gameKey$());
  const mutation = createMutation(() => ({
    mutationKey: ["guesses", "new"],
    mutationFn: async (value: EntitySearchResult) => {
      const gameKey = getGameKey();
      if (!gameKey) return;
      await guessArtist(value.id, gameKey);
    },
    onSettled: async () => {
      await client.invalidateQueries({
        queryKey: ["listGuesses"],
        exact: false,
      });
    },
  }));
  return (
    <div>
      <EntitySelector
        onSelected={(artist) => mutation.mutate(artist)}
        disabled={answerFound()}
      />
      <Show
        when={answerFound()}
        fallback={
          <div class="text-right">{guessList.data?.length}/10 guesses</div>
        }
      >
        <p>Congratulations! Today artist's is {correctArtist()?.artist.name}</p>
      </Show>
    </div>
  );
}

function ServerError(err: Error) {
  console.error("guesser err", err);
  return "failed";
}

function EntityGuesser() {
  return (
    <ErrorBoundary fallback={ServerError}>
      <SafeEntityGuesser />
    </ErrorBoundary>
  );
}

export { EntityGuesser };
