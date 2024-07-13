import { defineConfig, presetWind, transformerVariantGroup } from "unocss";
export default defineConfig({
  content: {
    filesystem: ["**/*.{ts,tsx}"],
  },
  transformers: [transformerVariantGroup()],
  presets: [presetWind()],
});
