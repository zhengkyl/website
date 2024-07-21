import { defineConfig, presetWind, transformerVariantGroup } from "unocss";
export default defineConfig({
  content: {
    filesystem: ["**/*.{ts,tsx}", "./posts/*.mdx"],
  },
  blocklist: ["my", "me", "h2"],
  transformers: [transformerVariantGroup()],
  presets: [presetWind()],
});
