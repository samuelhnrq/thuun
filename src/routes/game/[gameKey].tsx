import { ErrorBoundary } from "solid-js";
import { ArtistSelector } from "~/components/ArtistSelector";
import { GuessList } from "~/components/GuessList";

function ErrorHandler(err: Error) {
  if (err.message === "No session") {
    return <div>You are not logged in</div>;
  }
  return <div>Something went wrong: {err.message}</div>;
}

function GameKey() {
  return (
    <ErrorBoundary fallback={ErrorHandler}>
      <ArtistSelector />
      <GuessList />
    </ErrorBoundary>
  );
}

export { GameKey };
