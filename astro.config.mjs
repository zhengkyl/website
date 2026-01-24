// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), UnoCSS(), preact()],
});