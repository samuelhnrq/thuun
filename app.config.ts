import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    compatibilityDate: "2024-11-13",
    prerender: {
      crawlLinks: true,
    },
  },
});
