import { createMutation, useQueryClient } from "@tanstack/solid-query";
import {
  Subject,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs";
import { Show, createSignal, from } from "solid-js";
import type { ArtistSearchResult } from "~/lib/models";
import { gameKey$, globalState$ } from "~/lib/state";
import { useListGuesses } from "~/lib/use-list-guesses";
import { guessArtist } from "~/server/api/procedures/guess-artist";
import { searchArtist } from "~/server/api/procedures/search-artist";
import { Combobox } from "./Combobox";
import { Loading } from "./Loading";

const textInput = new Subject<string>();

const artistList$ = textInput.pipe(
  debounceTime(500),
  distinctUntilChanged(),
  combineLatestWith(globalState$),
  switchMap(([searched, state]) => searchArtist(searched, state.gameKey)),
);

function ArtistSelector() {
  const [artist, setArtist] = createSignal<ArtistSearchResult | null>(null);
  const [disabled, setDisabled] = createSignal(false);
  const [text, setText] = createSignal("");
  const client = useQueryClient();
  const guessList = useListGuesses();
  const answerFound = () => guessList.data?.find((x) => x.correct);
  const options = from(artistList$);
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
