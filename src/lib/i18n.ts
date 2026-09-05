// English-only bundle for v1 (Q24). The record type stays open so other
// languages can be added later without changing call sites.
export const I18nKeys = [
	"home",
	"about",
	"archive",
	"search",
	"tags",
	"categories",
	"recentPosts",
	"untitled",
	"uncategorized",
	"noTags",
	"themeColor",
	"lightMode",
	"darkMode",
	"more",
	"author",
	"publishedAt",
	"license",
] as const;

export type I18nKey = (typeof I18nKeys)[number];

const en: Record<I18nKey, string> = {
	home: "Home",
	about: "About",
	archive: "Archive",
	search: "Search",
	tags: "Tags",
	categories: "Categories",
	recentPosts: "Recent Posts",
	untitled: "Untitled",
	uncategorized: "Uncategorized",
	noTags: "No Tags",
	themeColor: "Theme Color",
	lightMode: "Light",
	darkMode: "Dark",
	more: "More",
	author: "Author",
	publishedAt: "Published at",
	license: "License",
};

export function t(key: I18nKey): string {
	return en[key];
}
