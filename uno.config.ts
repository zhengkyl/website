import { defineConfig, presetWind3, transformerVariantGroup } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["src/**/*.{astro,tsx,ts}", "src/content/**/*.mdx"],
  },
  blocklist: ["my", "me", "h2", "h3", "b", "transform", "filter"],
  rules: [["pixelated", { "image-rendering": "pixelated" }]],
  transformers: [transformerVariantGroup()],
  presets: [presetWind3()],
});
