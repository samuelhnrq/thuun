import { ErrorBoundary } from "solid-js";
import ArtistSelector from "~/components/ArtistSelector";
import { GuessList } from "~/components/GuessList";
import { Navbar } from "~/components/Navbar";
import { cn } from "~/lib/cn";

export default function Home() {
  return (
    <main class={cn("flex flex-col bg-bg text-text h-screen items-center")}>
      <Navbar />
      <div
        class={cn(
          "flex flex-col gap-4 justify-center align-middle px-5",
          "basis-[60vw] flex-grow min-w-[60vw]",
        )}
      >
        <ErrorBoundary
          fallback={(err) => <div>Something went wrong: {err}</div>}
        >
          <ArtistSelector />
          <GuessList />
        </ErrorBoundary>
      </div>
    </main>
  );
}
