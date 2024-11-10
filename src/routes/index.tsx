import { A } from "@solidjs/router";
import dayjs from "dayjs";
import { Navbar } from "~/components/Navbar";
import { cn } from "~/lib/cn";

export default function Home() {
  // const load = action(async (data: FormData) => {});
  return (
    <main class={cn("flex flex-col bg-bg text-text h-screen items-center")}>
      <Navbar />
      <div
        class={cn(
          "flex flex-col gap-4 justify-center align-middle px-5",
          "basis-[60vw] flex-grow min-w-[60vw]",
        )}
      >
        <A href={`/game/${dayjs().startOf("day").toISOString()}`}>Go to Game</A>
      </div>
    </main>
  );
}
