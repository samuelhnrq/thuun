import { createQuery } from "@tanstack/solid-query";
import { listGuesses } from "~/server/api/procedures/list-guesses";

export function useListGuesses() {
  return createQuery(() => ({
    queryKey: ["listGuesses"],
    experimental_prefetchInRender: true,
    queryFn: () => listGuesses(),
    reconcile: "artist.id",
  }));
}
