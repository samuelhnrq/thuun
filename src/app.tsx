import "./app.css";

import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import {
  QueryClient,
  type QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/solid-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ErrorBoundary, type ParentProps, Suspense } from "solid-js";
import { isServer } from "solid-js/web";

dayjs.extend(utc);

function createQueryClient() {
  const config: QueryClientConfig = {
    defaultOptions: {
      queries: { throwOnError: true, staleTime: 1000 },
    },
  };
  if (isServer) {
    return new QueryClient(config);
  }
  window.queryClient ??= new QueryClient(config);
  return window.queryClient;
}

function GlobalErrorHandler(err: Error) {
  console.error("global bad", err);
  return "Something went wrong";
}

function Root(props: ParentProps) {
  return (
    <MetaProvider>
      <Title>SolidStart - Basic</Title>
      <Suspense fallback="Loading route">
        <QueryClientProvider client={createQueryClient()}>
          <ErrorBoundary fallback={GlobalErrorHandler}>
            {props.children}
          </ErrorBoundary>
          {/* <SolidQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </Suspense>
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
