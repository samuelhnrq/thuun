import { useNavigate } from "@solidjs/router";
import dayjs from "dayjs";
import { Show } from "solid-js";
import { createSignal } from "solid-js";
import { v1 as uuid } from "uuid";
import { EntitySelector } from "~/components/EntitySelector";
import { Scaffolding } from "~/components/Scaffolding";
import type { EntitySearchResult } from "~/lib/models";
import { FaSolidCalendar } from "solid-icons/fa";
import { createGame } from "~/server/api/procedures/create-game";
import Button from "~/components/Button";
import { GamesList } from "~/components/GamesList";

export default function Home() {
  const [shown, setShown] = createSignal(false);
  const handler = async (answer: EntitySearchResult) => {
    const key = uuid().split("-")[0];
    try {
      await createGame(key, answer.id);
      navigte(`/game/${key}`);
    } catch (err) {
      console.error("failed to create game", err);
      return;
    }
  };
  const navigte = useNavigate();
  return (
    <Scaffolding>
      <Button
        onclick={() =>
          navigte(`/game/${dayjs().utc().startOf("day").toISOString()}`)
        }
      >
        <FaSolidCalendar class="inline-block mr-2x" />
        Go to The Daily Game
      </Button>
      <GamesList />
      <Show
        when={shown()}
        fallback={<Button onClick={() => setShown(true)}>New game</Button>}
      >
        <div class="transition-all duration-500 ease-in-out">
          Select the answer:
          <EntitySelector onSelected={handler} />
          <Button onClick={() => setShown(false)}>Cancel</Button>
        </div>
      </Show>
    </Scaffolding>
  );
}
