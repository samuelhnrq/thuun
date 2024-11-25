import { createQuery } from "@tanstack/solid-query";
import { listGames } from "~/server/api/procedures/list-games";

export function useListGames() {
  return createQuery(() => ({
    queryKey: ["listGames"],
    queryFn: () => listGames(),
    reconcile: "gameKey",
  }));
}
