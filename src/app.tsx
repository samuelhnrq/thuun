import "./app.css";

import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ErrorBoundary, Suspense } from "solid-js";

dayjs.extend(utc);

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
          <QueryClientProvider client={createQueryClient()}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <Suspense fallback={"Loading..."}>{props.children}</Suspense>
            </ErrorBoundary>
            <SolidQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
