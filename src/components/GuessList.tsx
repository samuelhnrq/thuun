import { createQuery } from "@tanstack/solid-query";
import { For } from "solid-js";
import { api } from "~/lib/api";

function GuessList() {
  const res = createQuery(() => ({
    queryKey: ["listGuesses"],
    experimental_prefetchInRender: true,
    queryFn: () => api.listGuesses.query(),
  }));
  return (
    <div>
      We have {res.data?.length} guesses
      <For each={res.data}>
        {(x) => (
          <div>
            <h2>{x.artist.name}</h2>
          </div>
        )}
      </For>
    </div>
  );
}

export default GuessList;
export { GuessList };
