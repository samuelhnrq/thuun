import { A } from "@solidjs/router";
import clsx from "clsx";
import { For, Suspense } from "solid-js";
import type { Game } from "~/lib/models";
import { useListGames } from "~/lib/use-list-games";
import { Loading } from "./Loading";

function LinkToGame(game: Game) {
  return (
    <A
      href={`/game/${game.gameKey}`}
      class={clsx(
        "px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-900 ",
        "block w-full",
      )}
    >
      {game.gameKey} - Created at {game.createdAt.toLocaleString()}
    </A>
  );
}

function GamesList() {
  const res = useListGames();
  return (
    <div class="max-h-[70vh] overflow-y-auto">
      <Suspense fallback={<Loading height="40px" />}>
        <div
          id="container"
          class={clsx(
            " bg-gray-400 dark:bg-gray-800 border-solid",
            "border-[1px] rounded-md ring-slate-100 max-h-[20vh] overflow-y-auto",
          )}
        >
          <For each={res.data}>{LinkToGame}</For>
        </div>
      </Suspense>
    </div>
  );
}

export { GamesList };
