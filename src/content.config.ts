import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

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

export const collections = { notes, posts };
