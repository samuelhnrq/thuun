import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "ui-sans-serif"],
      },
      colors: {
        primary: "rgb(var(--color-primary))",
        secondary: "rgb(var(--color-secondary))",
        bg: "rgb(var(--color-bg))",
        text: "rgb(var(--color-text))",
      },
    },
  },
  plugins: [],
};

export default config;
