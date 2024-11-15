import { useParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { EntityGuesser } from "~/components/EntityGuesser";
import { GuessList } from "~/components/GuessList";
import { Scaffolding } from "~/components/Scaffolding";
import { dispatchGameKey } from "~/lib/state";

function GameKey() {
  const params = useParams();
  createEffect(() => {
    dispatchGameKey(params.gameKey);
  });
  return (
    <Scaffolding>
      <EntityGuesser />
      <GuessList />
    </Scaffolding>
  );
}

export default GameKey;
