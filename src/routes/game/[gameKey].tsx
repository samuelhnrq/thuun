import { EntityGuesser } from "~/components/EntityGuesser";
import { GuessList } from "~/components/GuessList";
import { Scaffolding } from "~/components/Scaffolding";

function GameKey() {
  return (
    <Scaffolding>
      <EntityGuesser />
      <GuessList />
    </Scaffolding>
  );
}

export default GameKey;
