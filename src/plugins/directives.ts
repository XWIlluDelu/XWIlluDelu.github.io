import type { Blockquote, Emphasis, Image, Link, Paragraph, Strong } from "mdast";
import { defineMdastPlugin } from "satteri";
import { admonitionTitle, compactNumber, isAdmonitionType, parseGithubRepo } from "@/lib/directives";
import { readFileSync, statSync } from "node:fs";
import { GITHUB_CACHE_PATH } from "@/loaders/github";

/** mdast types omit hProperties, but the converter reads them at runtime. */
function withProps<T extends object>(
	node: T,
	className: string[],
	extra?: Record<string, string>,
	tag?: string,
): T {
	(node as { data?: unknown }).data = {
		...(tag ? { hName: tag } : {}),
		hProperties: { className, ...extra },
	};
	return node;
}

interface CachedRepo {
	description: string;
	stars: number;
	forks: number;
	license: string;
	language: string;
	avatar: string;
}

let cacheMtime = 0;
let cache: Record<string, CachedRepo> = {};

function lookupRepo(repo: string): CachedRepo | undefined {
	try {
		const mtime = statSync(GITHUB_CACHE_PATH).mtimeMs;
		if (mtime !== cacheMtime) {
			cache = JSON.parse(readFileSync(GITHUB_CACHE_PATH, "utf-8"));
			cacheMtime = mtime;
		}
	} catch {
		return undefined;
	}
	return cache[repo];
}

/** Handles :::admonition, ::github{repo}, and :spoiler directives. */
export const directivesPlugin = defineMdastPlugin({
	name: "huwari-directives",

  containerDirective(node, ctx) {
    if (!isAdmonitionType(node.name)) return;
    const type = node.name.toLowerCase();

    let label: string | undefined;
    let body = node.children;
    const [first, ...rest] = node.children;
    if (
      first?.type === "paragraph" &&
      (first.data as { directiveLabel?: unknown } | undefined)?.directiveLabel
    ) {
      label = ctx.textContent(first);
      body = rest;
    }

    const title: Paragraph = {
      type: "paragraph",
      children: [{ type: "text", value: admonitionTitle(type, label) }],
    };
    const quote: Blockquote = {
      type: "blockquote",
      children: [withProps(title, ["admonition-title"]), ...body],
    };
    return withProps(quote, ["admonition", `admonition-${type}`]);
  },

	leafDirective(node) {
		if (node.name !== "github") return;
		const repo = parseGithubRepo(node.attributes?.repo ?? "");
		if (!repo) {
			const empty: Paragraph = { type: "paragraph", children: [] };
			return empty;
		}
		const full = `${repo.owner}/${repo.name}`;
		const info = lookupRepo(full);
		const avatar: Image = {
			type: "image",
			url: info?.avatar || `https://github.com/${repo.owner}.png`,
			alt: `${repo.owner} avatar`,
		};
		const owner: Emphasis = {
			type: "emphasis",
			children: [withProps(avatar, ["gc-avatar"]), { type: "text", value: repo.owner }],
		};
		const titlebar: Emphasis = {
			type: "emphasis",
			children: [
				withProps(owner, ["gc-owner"], undefined, "span"),
				{ type: "text", value: " / " },
				{
					type: "strong",
					children: [{ type: "text", value: repo.name }],
				},
			],
		};
		const description: Emphasis = {
			type: "emphasis",
			children: [{ type: "text", value: info?.description || "No description" }],
		};
		const stat = (value: string): Emphasis => ({
			type: "emphasis",
			children: [{ type: "text", value }],
		});
		const infoBar: Emphasis = {
			type: "emphasis",
			children: [
				withProps(stat(info ? compactNumber(info.stars) : "—"), ["gc-stars"], undefined, "span"),
				withProps(stat(info ? compactNumber(info.forks) : "—"), ["gc-forks"], undefined, "span"),
				withProps(stat(info?.license || "—"), ["gc-license"], undefined, "span"),
				withProps(stat(info?.language || "—"), ["gc-language"], undefined, "span"),
			],
		};
		const card: Link = {
			type: "link",
			url: `https://github.com/${full}`,
			title: null,
			children: [
				withProps(titlebar, ["gc-titlebar"], undefined, "div"),
				withProps(description, ["gc-description"], undefined, "p"),
				withProps(infoBar, ["gc-infobar"], undefined, "div"),
			],
		};
		return withProps(card, ["github-card"]);
	},

  textDirective(node) {
    if (node.name !== "spoiler") return;
    const wrapper: Strong = { type: "strong", children: node.children };
    return withProps(wrapper, ["spoiler"]);
  },
});
