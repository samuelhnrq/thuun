import "./app.css";

import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ErrorBoundary, Suspense, type ParentProps } from "solid-js";

dayjs.extend(utc);

function createQueryClient() {
  const config: QueryClientConfig = {
    defaultOptions: {
      queries: { experimental_prefetchInRender: true },
    },
  };
  if (typeof window !== "undefined") {
    window.queryClient ??= new QueryClient(config);
    return window.queryClient;
  }
  return new QueryClient(config);
}

function GlobalErrorHandler(err: Error) {
  console.error("global bad", err);
  return "Something went wrong";
}

function Root(props: ParentProps) {
  return (
    <MetaProvider>
      <Title>SolidStart - Basic</Title>
      <QueryClientProvider client={createQueryClient()}>
        <ErrorBoundary fallback={GlobalErrorHandler}>
          <Suspense fallback="Loading route">{props.children}</Suspense>
        </ErrorBoundary>
        <SolidQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </MetaProvider>
  );
}

export default function App() {
  return (
    <Router preload root={Root}>
      <FileRoutes />
    </Router>
  );
}
