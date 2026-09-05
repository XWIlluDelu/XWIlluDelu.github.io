import { type CollectionEntry, getCollection } from "astro:content";
import { attachPrevNext, type PostMeta, slugFromId, sortPostsByPublishedDesc } from "./posts";

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

export interface CountedLabel {
  name: string;
  count: number;
}

export async function getTagList(): Promise<CountedLabel[]> {
  const posts = await getSortedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.entry.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}

export async function getCategoryList(): Promise<CountedLabel[]> {
  const posts = await getSortedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    const category = post.entry.data.category.trim();
    if (!category) continue;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}
