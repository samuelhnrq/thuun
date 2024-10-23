import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Subject, debounceTime, shareReplay, switchMap } from "rxjs";
import { Show, createSignal, from, onMount } from "solid-js";
import type { ArtistSearchResult } from "~/lib/models";
import { guessArtist } from "~/server/api/procedures/guess-artist";
import { searchArtist } from "~/server/api/procedures/search-artist";
import { Combobox } from "./Combobox";
import { Loading } from "./Loading";

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
  const mutation = createMutation(() => ({
    mutationKey: ["guessArtist"],
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
  onMount(() => textInput.next(""));
  const [text, setText] = createSignal("");
  const options = from(textInput$);
  return (
    <>
      <Combobox
        options={options() || []}
        label="Artist"
        value={artist()}
        disabled={disabled()}
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
    </>
  );
}
