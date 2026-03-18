import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

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

    // "YYYY-MM-DD" parsed as UTC, so need to reconstruct in local time.
    posted: z
      .date()
      .transform(
        (d) => new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
      ),
    edited: z
      .date()
      .transform(
        (d) => new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
      )
      .optional(),
  }),
});

export const collections = { posts };
