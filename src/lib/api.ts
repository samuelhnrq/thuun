import {
  createTRPCClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { getRequestEvent } from "solid-js/web";
import SuperJSON from "superjson";
import type { AppRouter } from "~/server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  // replace example.com with your actual production url
  if (process.env.NODE_ENV === "production") {
    return "https://example.com";
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

// create the client, export it
export const api = createTRPCClient<AppRouter>({
  links: [
    // will print out helpful logs when using client
    loggerLink({ enabled: (op) => op.direction !== "down" }),
    // identifies what url will handle trpc requests
    unstable_httpBatchStreamLink({
      transformer: SuperJSON,
      url: `${getBaseUrl()}/api/trpc`,
      fetch(url, options = {}) {
        let originalCookies = "";
        if (typeof window === "undefined") {
          const event = getRequestEvent();
          originalCookies = event?.request.headers.get("cookie") ?? "";
          if (originalCookies) {
            const headers = new Headers(options.headers);
            // we're in the server, so we need to forward the cookies
            headers.set("cookie", originalCookies);
            options.headers = headers;
          }
        }
        return fetch(url, options);
      },
    }),
  ],
});
