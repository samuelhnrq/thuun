import type { APIEvent } from "@solidjs/start/server";
import { TRPCError, initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { getSession } from "../auth";
import { db } from "../database";

export const createContext = (event: APIEvent) => {
  return {
    event,
    db,
  };
};

export const t = initTRPC.context<typeof createContext>().create({
  transformer: SuperJSON,
  isServer: true,
  errorFormatter: (err) => `${err.error.message}`,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await getSession(ctx.event.request);
  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, session } });
});
