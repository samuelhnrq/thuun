import { Subject, debounceTime, shareReplay, switchMap } from "rxjs";
import { Show, createSignal, from } from "solid-js";
import { api } from "~/lib/api";
import type { ArtistSearchResult } from "~/lib/models";
import { Combobox } from "./AppCombobox";
import { Loading } from "./Loading";

const textInput = new Subject<string>();
const textInput$ = textInput.asObservable().pipe(
  debounceTime(500),
  switchMap((searched) => api.searchArtist.query(searched)),
  shareReplay(1),
);

export default function ArtistSelector() {
  const [artist, setArtist] = createSignal<ArtistSearchResult | null>(null);
  const [disabled, setDisabled] = createSignal(false);
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
        onChange={async (value) => {
          if (!value) {
            setText("");
            return;
          }
          setArtist(value);
          setDisabled(true);
          document.body.focus();
          await api.guessArtist.mutate(value.id);
          setArtist(null);
          setDisabled(false);
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
