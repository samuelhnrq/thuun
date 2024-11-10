import { Suspense } from "solid-js";
import { ArtistSelector } from "~/components/ArtistSelector";
import { GuessList } from "~/components/GuessList";
import { Scaffolding } from "~/components/Scaffolding";

function GameKey() {
  return (
    <Scaffolding>
      <Suspense>
        <ArtistSelector />
        <GuessList />
      </Suspense>
    </Scaffolding>
  );
}

export default GameKey;
