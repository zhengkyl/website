// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), UnoCSS(), preact()],
  redirects: {
    "/posts/ssh_game_of_life": "/writes/ssh-game-of-life",
    "/posts/crafting_qr_codes": "/writes/crafting-qr-codes",
    "/posts/few_word_why_tailwind_not_bad":
      "/writes/few-word-why-tailwind-good",
    "/posts/time_travel_homework_2026": "/writes/time-travel-homework-2026",

    // tmp, probably zero links to these new urls
    "/writes/posts/ssh-game-of-life": "/writes/ssh-game-of-life",
    "/writes/posts/crafting-qr-codes": "/writes/crafting-qr-codes",
    "/writes/notes/few-word-why-tailwind-good":
      "/writes/few-word-why-tailwind-good",
    "/writes/notes/time-travel-homework-2026":
      "/writes/time-travel-homework-2026",
  },
  markdown: {
    shikiConfig: {
      theme: "plastic",
    },
  },
});
