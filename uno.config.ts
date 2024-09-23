import { defineConfig, presetWind, transformerVariantGroup } from "unocss";

export default defineConfig({
  content: {
    filesystem: [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "posts/*.mdx",
      "mdx-components.tsx",
    ],
  },
  blocklist: ["my", "me", "h2", "b", "transform", "filter"],
  rules: [["pixelated", { "image-rendering": "pixelated" }]],
  transformers: [transformerVariantGroup()],
  presets: [presetWind()],
});
