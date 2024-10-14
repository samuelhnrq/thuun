import { createQuery } from "@tanstack/solid-query";
import { For } from "solid-js";
import { api } from "~/lib/api";

function GuessList() {
  const res = createQuery(() => ({
    queryKey: ["listGuesses"],
    queryFn: () => api.listGuesses.query(),
    throwOnError: false, // Throw an error if the query fails
  }));
  return (
    <div>
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
