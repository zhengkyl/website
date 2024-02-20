import { defineConfig, presetWind } from "unocss";
export default defineConfig({
  content: {
    filesystem: ["**/*.{ts,tsx}"],
  },
  presets: [presetWind()],
});
