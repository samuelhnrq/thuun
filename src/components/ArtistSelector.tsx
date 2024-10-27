import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Subject, debounceTime, shareReplay, switchMap } from "rxjs";
import { Show, createSignal, from, onMount, createMemo } from "solid-js";
import type { ArtistSearchResult } from "~/lib/models";
import { guessArtist } from "~/server/api/procedures/guess-artist";
import { searchArtist } from "~/server/api/procedures/search-artist";
import { Combobox } from "./Combobox";
import { Loading } from "./Loading";
import { useListGuesses } from "~/lib/use-list-guesses";

const textInput = new Subject<string>();
const textInput$ = textInput.asObservable().pipe(
  debounceTime(500),
  switchMap((searched) => searchArtist(searched)),
  shareReplay(1),
);

export default function ArtistSelector() {
  const [artist, setArtist] = createSignal<ArtistSearchResult | null>(null);
  const [disabled, setDisabled] = createSignal(false);
  const client = useQueryClient();
  const guessList = useListGuesses();
  const mutation = createMutation(() => ({
    mutationKey: ["guesses", "new"],
    mutationFn: async (value: ArtistSearchResult) => {
      await guessArtist(value.id);
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
  const answerFound = createMemo(() => guessList.data?.find((x) => x.correct));
  onMount(() => textInput.next(""));
  const [text, setText] = createSignal("");
  const options = from(textInput$);
  return (
    <>
      <Combobox
        options={options() || []}
        label="Artist"
        value={artist()}
        disabled={disabled() || guessList.isPending || !!answerFound()}
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
