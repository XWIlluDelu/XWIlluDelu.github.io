import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { githubLoader } from "./loaders/github";
import { siteLoader } from "./loaders/site";

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
		author: z.string().trim().min(1).optional(),
	}),
});

const bannerSchema = z.object({
	src: z.string().min(1),
	credit: z.object({ text: z.string().min(1), url: z.url() }).optional(),
});
const seasonalThemeSchema = z.object({
	hue: z.number().min(0).max(360),
	banner: bannerSchema,
	avatar: z.string().trim().min(1).optional(),
});

const site = defineCollection({
	loader: siteLoader(),
	schema: z.object({
		title: z.string().min(1),
		subtitle: z.string(),
		lang: z.string().min(1),
		banner: bannerSchema,
		seasonalThemes: z.object({
			spring: seasonalThemeSchema,
			summer: seasonalThemeSchema,
			autumn: seasonalThemeSchema,
			winter: seasonalThemeSchema,
		}).optional(),
		colorPicker: z.boolean().optional(),
		fonts: z.literal("noto").optional(),
		postAttribution: z.object({
			license: z.object({ name: z.string().min(1), url: z.url() }).optional(),
		}).optional(),
		navigation: z.array(z.object({ name: z.string().min(1), url: z.url() })).optional(),
		profile: z.object({
			name: z.string().min(1),
			bio: z.string(),
			avatar: z.string().min(1),
			links: z.array(z.object({
				name: z.string(),
				url: z.string().url(),
				icon: z.enum(["github", "bilibili", "steam"]).optional(),
			})),
		}),
	}),
});

const github = defineCollection({
	loader: githubLoader("./src/content"),
	schema: z.object({
		repo: z.string(),
		owner: z.string(),
		name: z.string(),
		description: z.string(),
		stars: z.number(),
		forks: z.number(),
		license: z.string(),
		language: z.string(),
		avatar: z.string(),
	}),
});

export const collections = { posts, site, github };
