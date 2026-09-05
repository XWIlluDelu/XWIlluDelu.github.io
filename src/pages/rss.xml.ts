import rss from "@astrojs/rss";
import { getEntry } from "astro:content";
import { getSortedPosts } from "@/lib/content";
import { postUrl } from "@/lib/urls";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
	const site = await getEntry("site", "config");
	if (!site) throw new Error("Site config not found");
	const posts = await getSortedPosts();
	return rss({
		title: site.data.title,
		description: site.data.subtitle,
		site: context.site ?? "https://l4ph.github.io/huwari/",
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.published,
      description: post.entry.data.description,
      link: postUrl(post.slug),
    })),
  });
}
