import { createQuery } from "@tanstack/solid-query";
import { firstValueFrom, mergeMap } from "rxjs";
import { listGuesses } from "~/server/api/procedures/list-guesses";
import { gameKey$ } from "./state";

export function useListGuesses() {
  return createQuery(() => ({
    queryKey: ["listGuesses"],
    experimental_prefetchInRender: true,
    queryFn: () =>
      firstValueFrom(gameKey$.pipe(mergeMap((x) => listGuesses(x)))),
    reconcile: "artist.id",
  }));
}
