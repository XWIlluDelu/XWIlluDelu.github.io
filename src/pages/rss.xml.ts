import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getSortedPosts } from "@/lib/content";
import { postUrl } from "@/lib/urls";

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  return rss({
    title: "Huwari",
    description: "A minimal Astro blog template",
    site: context.site ?? "https://huwari.example.com/",
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.published,
      description: post.entry.data.description,
      link: postUrl(post.slug),
    })),
  });
}
