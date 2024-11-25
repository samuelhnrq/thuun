import { createQuery } from "@tanstack/solid-query";
import { listGuesses } from "~/server/api/procedures/list-guesses";
import { gameKey$ } from "./state";
import { from } from "solid-js";

export function useListGuesses() {
  const gameKey = from(gameKey$());
  return createQuery(() => ({
    queryKey: ["listGuesses", gameKey()],
    enabled: !!gameKey(),
    queryFn: async () => listGuesses(gameKey() || "unreachable"),
    reconcile: "artist.id",
  }));
}
