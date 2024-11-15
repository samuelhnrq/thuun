import {
  Subject,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeWith,
  switchMap,
} from "rxjs";
import { Show, Suspense, from, onMount } from "solid-js";
import type { EntitySearchResult } from "~/lib/models";
import { globalState$ } from "~/lib/state";
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

const loading$ = textInput.pipe(
  mergeWith(artistList$),
  map((x) => !Array.isArray(x)),
);

function EntitySelector(props: {
  onSelected: (artist: EntitySearchResult) => Promise<void> | void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const options = from(artistList$);
  const text = from(textInput);
  const isLoading = from(loading$);
  onMount(() => textInput.next(""));
  const onChange = async (value: EntitySearchResult | null) => {
    if (!value) {
      textInput.next("");
      return;
    }
    document.body.focus();
    await props.onSelected(value);
  };
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Combobox
          options={options() || []}
          label="Artist"
          disabled={props.disabled}
          optionTextValue={(val) => val.name}
          optionValue={(val) => val.id}
          optionLabel={(val) => val.name}
          onChange={(value) => onChange(value)}
          onInputChange={(value) => textInput.next(value)}
          inputProps={{
            placeholder: "Search for an artist",
            value: text(),
            autofocus: true,
          }}
        />
        <Show when={isLoading()}>
          <Loading />
        </Show>
      </Suspense>
    </div>
  );
}

export { EntitySelector };
