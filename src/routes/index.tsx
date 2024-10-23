import { ErrorBoundary } from "solid-js";
import ArtistSelector from "~/components/ArtistSelector";
import GuessList from "~/components/GuessList";
import { Navbar } from "~/components/Navbar";
import { cn } from "~/lib/cn";

export default function Home() {
  return (
    <main class={cn("flex flex-col bg-bg text-text h-screen")}>
      <Navbar />
      <div class="flex flex-col gap-4 flex-1 justify-center align-middle px-5">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ArtistSelector />
          <GuessList />
        </ErrorBoundary>
      </div>
    </main>
  );
}
