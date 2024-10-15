import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import { cn } from "~/lib/cn";
import { useSession } from "~/lib/session";
import ArtistSelector from "~/components/ArtistSelector";

export default function Home() {
  const session = useSession();
  return (
    <main
      class={cn(
        "flex flex-col items-center justify-center gap-4 p-4 h-screen",
        "bg-bg text-text"
      )}
    >
      <Title>Hello World</Title>
      <p>Session: {session?.user?.name || "None"}</p>
      <Counter />
      <ArtistSelector />
      <p>Hot reload works!</p>
    </main>
  );
}
