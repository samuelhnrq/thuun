import kobalte from "@kobalte/tailwindcss";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        primary: "rgb(var(--color-primary))",
        secondary: "rgb(var(--color-secondary))",
        bg: "rgb(var(--color-bg))",
        bgDarker: "rgb(var(--color-bg-darker))",
        text: "rgb(var(--color-text))",
      },
      animation: {
        contentShow: "contentShow 0.2s ease-in-out",
        contentHide: "contentHide 0.2s ease-in-out",
      },
      keyframes: {
        contentShow: {
          from: {
            opacity: "0",
            transform: "translateY(-8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        contentHide: {
          from: {
            opacity: "1",
            transform: "translateY(0)",
          },
          to: {
            opacity: "0",
            transform: "translateY(-8px)",
          },
        },
      },
    },
  },
  plugins: [kobalte],
};

export default config;
