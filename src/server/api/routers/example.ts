import { wrap } from "@typeschema/valibot";
import { string } from "valibot";
import { createTRPCRouter, privateProcedure } from "../utils";

export const exampleRouter = createTRPCRouter({
  hello: privateProcedure.input(wrap(string())).query(({ input }) => {
    return `Hello ${input}!`;
  }),
});
