/// <reference types="@solidjs/start/env" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly DB_URL: string;
    readonly DB_PASSWORD: string;
  }
}
