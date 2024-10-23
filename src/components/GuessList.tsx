import { createQuery } from "@tanstack/solid-query";
import { For } from "solid-js";
import { api } from "~/lib/api";
import type { GuessAnswer, PropComparison } from "~/lib/models";

function Comparision(comparision: PropComparison) {
  return (
    <div>
      <h2>{comparision.name}</h2>
      <p>{comparision.kind}</p>
      <p>{comparision.value}</p>
      <h2>{comparision.correct ? "Correct" : "Wrong"}</h2>
    </div>
  );
}

function GuessedArtist(comparision: GuessAnswer) {
  return (
    <div>
      <h1>{comparision.artist.name}</h1>
      <p>{comparision.correct ? "Correct" : "Wrong"}</p>
      <div class="flex gap-4">
        <For each={comparision.comparisions}>{Comparision}</For>
      </div>
    </div>
  );
}

function GuessList() {
  const res = createQuery(() => ({
    queryKey: ["listGuesses"],
    experimental_prefetchInRender: true,
    queryFn: () => api.listGuesses.query(),
    reconcile: "artist.id",
  }));
  return (
    <div class="max-h-[70vh] overflow-y-scroll">
      We have {res.data?.length} guesses
      <For each={res.data}>{GuessedArtist}</For>
    </div>
  );
}

export default GuessList;
export { GuessList };
