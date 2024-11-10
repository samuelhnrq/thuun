import { A } from "@solidjs/router";
import dayjs from "dayjs";
import { Scaffolding } from "~/components/Scaffolding";

export default function Home() {
  // const load = action(async (data: FormData) => {});
  return (
    <Scaffolding>
      <A href={`/game/${dayjs().startOf("day").toISOString()}`}>Go to Game</A>
    </Scaffolding>
  );
}
