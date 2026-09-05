import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Strict frontmatter for v1 (Q3). Navigation (prev/next) and computed
// reading stats live outside the schema: see src/lib/posts.ts and
// src/lib/reading.ts.
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

export const collections = { posts };
