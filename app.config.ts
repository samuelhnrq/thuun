import { defineConfig } from "@solidjs/start/config";
import Tailwind from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  server: {
    compatibilityDate: "2024-11-13",
  },
  vite: {
    plugins: [
      Icons({
        compiler: "solid",
      }),
      Tailwind(),
    ],
  },
});
