import "./app.css";

import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { ErrorBoundary, Suspense } from "solid-js";
import { SessionProvider } from "~/lib/session";

function createQueryClient() {
  if (typeof window !== "undefined") {
    window.queryClient ??= new QueryClient({});
    return window.queryClient;
  }
  return new QueryClient({});
}

export default function App() {
  return (
    <Router
      preload={true}
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Suspense fallback={"Loading..."}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <QueryClientProvider client={createQueryClient()}>
                <SessionProvider>{props.children}</SessionProvider>
                <SolidQueryDevtools initialIsOpen={false} />
              </QueryClientProvider>
            </ErrorBoundary>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
