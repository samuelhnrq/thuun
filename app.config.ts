import UnoCSS from "unocss/vite";
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "cloudflare-pages",
    rollupConfig: {
      external: ["node:async_hooks", "@gcornut/valibot-json-schema"],
    },
  },
  vite: {
    plugins: [UnoCSS()],
  },
});
