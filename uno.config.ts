import {
  defineConfig,
  presetWind,
  presetAttributify,
  presetIcons,
} from "unocss";

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
