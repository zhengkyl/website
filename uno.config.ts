import { defineConfig, presetWind, presetIcons } from "unocss";
import presetAttributify from "@unocss/preset-attributify";

export default defineConfig({
  content: {
    filesystem: ["**/*.{ts,tsx}"],
  },
  presets: [
    presetWind(),
    presetAttributify(),
    presetIcons({
      // scale: 1.25,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
  ],
});
