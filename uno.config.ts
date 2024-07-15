import { defineConfig, presetWind, transformerVariantGroup } from "unocss";
export default defineConfig({
  content: {
    filesystem: ["**/*.{ts,tsx}", "./posts/*.mdx"],
  },
  transformers: [transformerVariantGroup()],
  presets: [presetWind()],
});
