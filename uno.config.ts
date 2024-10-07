import {
  defineConfig,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import presetAnimations from "unocss-preset-animations";

export default defineConfig({
  presets: [
    presetUno({
      dark: {
        dark: '[data-kb-theme="dark"]',
        light: '[data-kb-theme="light"]',
      },
      prefix: "",
    }),
    presetAnimations(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    animation: {
      keyframes: {
        "accordion-down":
          "{ from { height: 0 } to { height: var(--kb-accordion-content-height) } }",
        "accordion-up":
          "{ from { height: var(--kb-accordion-content-height) } to { height: 0 } }",
        "collapsible-down":
          "{ from { height: 0 } to { height: var(--kb-collapsible-content-height) } }",
        "collapsible-up":
          "{ from { height: var(--kb-collapsible-content-height) } to { height: 0 } }",
        "caret-blink": "{ 0%,70%,100% { opacity: 1 } 20%,50% { opacity: 0 } }",
      },
      timingFns: {
        "accordion-down": "ease-out",
        "accordion-up": "ease-out",
        "collapsible-down": "ease-out",
        "collapsible-up": "ease-out",
        "caret-blink": "ease-out",
      },
      durations: {
        "accordion-down": "0.2s",
        "accordion-up": "0.2s",
        "collapsible-down": "0.2s",
        "collapsible-up": "0.2s",
        "caret-blink": "1.25s",
      },
      counts: {
        "caret-blink": "infinite",
      },
    },
  },
});
