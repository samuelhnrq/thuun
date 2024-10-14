import { guessArtist } from "./procedures/guessArtist";
import { listGuesses } from "./procedures/listGuesses";
import searchArtist from "./procedures/searchArtist";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
  guessArtist,
  listGuesses,
  searchArtist,
});

export type AppRouter = typeof appRouter;
