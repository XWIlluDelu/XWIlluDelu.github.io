function joinUrl(...parts: string[]): string {
  return parts.join("/").replace(/\/+/g, "/").replace(/\/$/, "");
}

export function postUrl(slug: string): string {
  return `${joinUrl("", "posts", slug)}/`;
}

export function tagUrl(tag: string): string {
	if (!tag.trim()) return "/archive/";
	return `/archive/?tag=${encodeURIComponent(tag.trim())}`;
}

export function categoryUrl(category: string | null | undefined): string {
	if (!category || !category.trim()) return "/archive/?uncategorized=true";
	return `/archive/?category=${encodeURIComponent(category.trim())}`;
}

export function pathsEqual(path1: string, path2: string): boolean {
  const normalize = (p: string) => p.replace(/^\/|\/$/g, "").toLowerCase();
  return normalize(path1) === normalize(path2);
}
