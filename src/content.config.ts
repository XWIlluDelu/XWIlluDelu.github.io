import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Navigation (prev/next) and reading stats are computed outside the schema.
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string().min(1),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    description: z.string().min(1),
    image: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().default(""),
    draft: z.boolean().optional().default(false),
    lang: z.string().optional().default(""),
  }),
});

const about = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
	schema: z.object({
		title: z.string().optional().default("About"),
	}),
});

export const collections = { posts, about };
