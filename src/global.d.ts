/// <reference types="@solidjs/start/env" />

import type { QueryClient } from "@tanstack/solid-query";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DB_URL: string;
    readonly DB_PASSWORD: string;
  }
}

declare global {
  interface Window {
    queryClient?: QueryClient;
  }
}
