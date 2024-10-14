import { guessArtist } from "./procedures/guess-artist";
import { listGuesses } from "./procedures/list-guesses";
import { searchArtist } from "./procedures/search-artist";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
  guessArtist,
  listGuesses,
  searchArtist,
});

export type AppRouter = typeof appRouter;
