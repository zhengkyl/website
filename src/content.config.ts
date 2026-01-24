// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { defineCollection } from "astro:content";
// Import Zod
import { z } from "astro/zod";
// Define a `loader` and `schema` for each collection

const notes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    posted: z.date(),
    edited: z.date().optional(),
  }),
});
const posts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.mdx",
    base: "./src/content/posts",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // image: z.object({
    //   url: z.string(),
    //   alt: z.string(),
    // }),
    tags: z.array(z.string()),
    posted: z.date(),
    edited: z.date().optional(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = { notes, posts };
