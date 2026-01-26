import { defineConfig, presetWind3, transformerVariantGroup } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["src/**/*.{astro,tsx,ts}", "src/content/**/*.mdx"],
  },
  shortcuts: {
    BlueLink: "underline text-blue-600 visited:text-purple-600",
    Heading1: "text-3xl md:text-5xl font-bold text-balance"
  } ,
  blocklist: ["my", "me", "h2", "h3", "b", "transform", "filter"],
  rules: [["pixelated", { "image-rendering": "pixelated" }]],
  transformers: [transformerVariantGroup()],
  presets: [presetWind3()],
});
