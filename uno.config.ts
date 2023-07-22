import { defineConfig, presetWind, presetAttributify } from "unocss";

export default defineConfig({
  content: {
    filesystem: ["**/*.{ts,tsx}"],
  },
  presets: [presetWind(), presetAttributify()],
});
