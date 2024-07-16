import { defineConfig, presetWind, transformerVariantGroup } from "unocss";
export default defineConfig({
  content: {
    filesystem: ["**/*.{ts,tsx}", "./posts/*.mdx"],
  },
  blocklist: ["my"],
  transformers: [transformerVariantGroup()],
  presets: [presetWind()],
});
