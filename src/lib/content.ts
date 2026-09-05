import { getCollection, type CollectionEntry } from "astro:content";
import {
	attachPrevNext,
	slugFromId,
	sortPostsByPublishedDesc,
	type PostMeta,
} from "./posts";

export type PostEntry = CollectionEntry<"posts">;

export interface PostListItem extends PostMeta {
	entry: PostEntry;
}

export async function getSortedPosts(): Promise<PostListItem[]> {
	const entries = await getCollection("posts", ({ data }) =>
		import.meta.env.PROD ? data.draft !== true : true,
	);
	const items: PostListItem[] = entries.map((entry) => ({
		slug: slugFromId(entry.id),
		title: entry.data.title,
		published: entry.data.published,
		entry,
	}));
	return sortPostsByPublishedDesc(items);
}

export async function getPostsWithNav() {
	const sorted = await getSortedPosts();
	return attachPrevNext(sorted);
}

export function groupPostsByYear<T extends PostMeta>(posts: T[]): { year: number; posts: T[] }[] {
	const groups = new Map<number, T[]>();
	for (const post of posts) {
		const year = post.published.getFullYear();
		const list = groups.get(year) ?? [];
		list.push(post);
		groups.set(year, list);
	}
	return [...groups.entries()]
		.map(([year, yearPosts]) => ({ year, posts: yearPosts }))
		.sort((a, b) => b.year - a.year);
}
