import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  map,
  mergeWith,
  shareReplay,
  skip,
  switchMap,
} from "rxjs";
import { Show, Suspense, createSignal, from } from "solid-js";
import type { EntitySearchResult } from "~/lib/models";
import { searchArtist } from "~/server/api/procedures/search-artist";
import { Combobox } from "./Combobox";
import { Loading } from "./Loading";
import { gameKey$ } from "~/lib/state";

const textInput = new BehaviorSubject<string>("");

const artistList$ = textInput.pipe(
  debounceTime(500),
  combineLatestWith(gameKey$),
  switchMap(([searched, gameKey]) => searchArtist(searched, gameKey)),
  shareReplay(1),
);

const loading$ = textInput.pipe(
  mergeWith(artistList$),
  skip(1),
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
  const [selectedOption] = createSignal<EntitySearchResult | null>(null);
  const onChange = async (value: EntitySearchResult | null) => {
    if (!value) {
      textInput.next("");
      return;
    }
    document.body.focus();
    await props.onSelected(value);
  };
  return (
    <Suspense fallback={<Loading />}>
      <Combobox
        options={options() || []}
        label="Artist"
        disabled={props.disabled}
        optionTextValue={(val) => val.name}
        optionValue={(val) => val.id}
        optionLabel={(val) => val.name}
        value={selectedOption()}
        onChange={async (value) => {
          await onChange(value);
          textInput.next("");
        }}
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
  );
}

export { EntitySelector };
