import { For } from "solid-js";
import { cn } from "~/lib/cn";
import type { GuessAnswer, PropComparison } from "~/lib/models";
import { useListGuesses } from "~/lib/use-list-guesses";

function colorClassCorrect(correct: boolean) {
  return {
    "text-red-700": !correct,
    "text-green-600": correct,
  };
}

function Comparision(comparision: PropComparison) {
  return (
    <div
      class={cn(
        "bg-slate-500 dark:bg-gray-800 basis-[30%] flex-grow px-4 py-2",
        "rounded-md ring-1 ring-slate-500",
      )}
    >
      <h2 class="text-lg">{comparision.name}</h2>
      <p
        class={cn(
          colorClassCorrect(comparision.correct),
          "text-2xl text-ellipsis overflow-hidden whitespace-nowrap",
        )}
      >
        {comparision.value}
      </p>
    </div>
  );
}

function GuessedArtist(comparision: GuessAnswer) {
  return (
    <div class={cn("mb-3 border-1 p-4 rounded-md align-bottom")}>
      <span class="text-2xl">{comparision.artist.name} </span>
      <span class={cn(colorClassCorrect(comparision.correct), "font-bold")}>
        {comparision.correct ? "Correct" : "Wrong"}
      </span>
      <div class="flex gap-4 flex-wrap justify-center">
        <For each={comparision.comparisions}>{Comparision}</For>
      </div>
    </div>
  );
}

function GuessList() {
  const res = useListGuesses();
  return (
    <div class="max-h-[70vh] overflow-y-scroll">
      <For each={res.data}>{GuessedArtist}</For>
    </div>
  );
}

export { GuessList };
