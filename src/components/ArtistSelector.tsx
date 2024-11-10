import { createMutation, useQueryClient } from "@tanstack/solid-query";
import {
  debounceTime,
  shareReplay,
  switchMap,
  combineLatestWith,
  BehaviorSubject,
} from "rxjs";
import { Show, createSignal, from } from "solid-js";
import type { ArtistSearchResult } from "~/lib/models";
import { useListGuesses } from "~/lib/use-list-guesses";
import { guessArtist } from "~/server/api/procedures/guess-artist";
import { searchArtist } from "~/server/api/procedures/search-artist";
import { Combobox } from "./Combobox";
import { Loading } from "./Loading";
import { gameKey$, globalState$ } from "~/lib/state";

const textInput = new BehaviorSubject<string>("");

const textInput$ = textInput.pipe(
  debounceTime(500),
  combineLatestWith(globalState$),
  switchMap(([searched, state]) => searchArtist(searched, state.gameKey)),
  shareReplay(1),
);

function ArtistSelector() {
  const [artist, setArtist] = createSignal<ArtistSearchResult | null>(null);
  const [disabled, setDisabled] = createSignal(false);
  const client = useQueryClient();
  const guessList = useListGuesses();
  const getGameKey = from(gameKey$);
  const mutation = createMutation(() => ({
    mutationKey: ["guesses", "new"],
    mutationFn: async (value: ArtistSearchResult) => {
      const gameKey = getGameKey();
      if (!gameKey) return;
      await guessArtist(value.id, gameKey);
    },
    onMutate(value) {
      setArtist(value);
      setDisabled(true);
      document.body.focus();
    },
    onSettled: async () => {
      setArtist(null);
      setDisabled(false);
      await client.invalidateQueries({
        queryKey: ["listGuesses"],
        exact: false,
      });
    },
  }));
  const answerFound = () => guessList.data?.find((x) => x.correct);
  const [text, setText] = createSignal("");
  const options = from(textInput$);
  return (
    <>
      <Combobox
        options={options() || []}
        label="Artist"
        value={artist()}
        disabled={disabled() || !!answerFound()}
        optionTextValue={(val) => val.name}
        optionValue={(val) => val.id}
        optionLabel={(val) => val.name}
        onChange={(value) => {
          if (!value) {
            setText("");
            return;
          }
          mutation.mutate(value);
        }}
        onInputChange={(value) => {
          textInput.next(value);
          setText(value);
        }}
        inputProps={{
          placeholder: "Search for an artist",
          value: text(),
          autofocus: true,
        }}
      />
      <Show when={disabled()}>
        <Loading />
      </Show>
      <Show when={!!answerFound()}>
        <p>Congratulations! Today artist's is {answerFound()?.artist.name}</p>
      </Show>
    </>
  );
}

export { ArtistSelector };
