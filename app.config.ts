import UnoCSS from "unocss/vite";
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  vite: {
    plugins: [UnoCSS()],
  },
});
