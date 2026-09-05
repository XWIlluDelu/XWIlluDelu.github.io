function joinUrl(...parts: string[]): string {
  return parts.join("/").replace(/\/+/g, "/").replace(/\/$/, "");
}

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean.startsWith(base) || base === "/") return clean;
  return joinUrl("", base, clean) + (clean.endsWith("/") ? "/" : "");
}

export function postUrl(slug: string): string {
  return withBase(`/posts/${slug}/`);
}

export function tagUrl(tag: string): string {
  if (!tag.trim()) return withBase("/archive/");
  return withBase(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

export function categoryUrl(category: string | null | undefined): string {
  if (!category || !category.trim()) return withBase("/archive/?uncategorized=true");
  return withBase(`/archive/?category=${encodeURIComponent(category.trim())}`);
}

export function pathsEqual(path1: string, path2: string): boolean {
  const normalize = (p: string) => p.replace(/^\/|\/$/g, "").toLowerCase();
  return normalize(path1) === normalize(path2);
}
