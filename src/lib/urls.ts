export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function joinUrl(...parts: string[]): string {
  return parts.join("/").replace(/\/+/g, "/").replace(/\/$/, "");
}

export function postUrl(slug: string): string {
  return `${joinUrl("", "posts", slug)}/`;
}

export function tagUrl(tag: string): string {
  if (!tag.trim()) return "/archive/";
  return `${joinUrl("", "tags", encodeURIComponent(slugify(tag)))}/`;
}

export function categoryUrl(category: string | null | undefined): string {
  if (!category || !category.trim()) return "/archive/";
  return `${joinUrl("", "categories", encodeURIComponent(slugify(category)))}/`;
}

export function pathsEqual(path1: string, path2: string): boolean {
  const normalize = (p: string) => p.replace(/^\/|\/$/g, "").toLowerCase();
  return normalize(path1) === normalize(path2);
}
