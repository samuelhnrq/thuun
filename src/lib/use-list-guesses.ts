import { createQuery } from "@tanstack/solid-query";
import { filter, firstValueFrom, mergeMap, take } from "rxjs";
import { listGuesses } from "~/server/api/procedures/list-guesses";
import { gameKey$ } from "./state";

export function useListGuesses() {
  return createQuery(() => ({
    queryKey: ["listGuesses"],
    queryFn: () =>
      firstValueFrom(
        gameKey$.pipe(
          take(1),
          filter((x): x is string => !!x),
          mergeMap((x) => listGuesses(x)),
        ),
      ),
    reconcile: "artist.id",
  }));
}
