import { Title } from "@solidjs/meta";
import ArtistSelector from "~/components/ArtistSelector";
import Counter from "~/components/Counter";
import GuessList from "~/components/GuessList";
import { Navbar } from "~/components/Navbar";
import { cn } from "~/lib/cn";
import { useSession } from "~/lib/session";

export default function Home() {
  const session = useSession();
  return (
    <main
      class={cn(
        "flex flex-col items-center justify-center gap-4",
        "bg-bg text-text h-screen",
      )}
    >
      <Navbar />
      <Title>Hello World</Title>
      <p>Session: {session?.user?.name || "None"}</p>
      <Counter />
      <ArtistSelector />
      <GuessList />
    </main>
  );
}
