export interface PostMeta {
  slug: string;
  title: string;
  published: Date;
}

export function slugFromId(id: string): string {
  const withoutExt = id.replace(/\.mdx?$/, "");
  return withoutExt.replace(/(^|\/)index$/, "").replace(/\/$/, "") || withoutExt;
}

export function sortPostsByPublishedDesc<T extends PostMeta>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.published.getTime() - a.published.getTime());
}

export function attachPrevNext<T extends PostMeta>(
  sortedDesc: T[],
): (T & {
  prevTitle?: string;
  prevSlug?: string;
  nextTitle?: string;
  nextSlug?: string;
})[] {
  return sortedDesc.map((post, i) => {
    const older = sortedDesc[i + 1];
    const newer = sortedDesc[i - 1];
    return {
      ...post,
      prevTitle: older?.title,
      prevSlug: older?.slug,
      nextTitle: newer?.title,
      nextSlug: newer?.slug,
    };
  });
}
