import type { Blockquote, Link, Paragraph, Strong } from "mdast";
import { defineMdastPlugin } from "satteri";
import {
	admonitionTitle,
	isAdmonitionType,
	parseGithubRepo,
} from "@/lib/directives";

/**
 * Attach hast properties to a freshly built mdast node.
 * The static mdast types do not declare hProperties, but the Sätteri
 * converter reads them at runtime (verified by src/plugins/directives.test.ts).
 */
function withProps<T extends object>(
	node: T,
	className: string[],
	extra?: Record<string, string>,
): T {
	(node as { data?: unknown }).data = {
		hProperties: { className, ...extra },
	};
	return node;
}

/**
 * Sätteri-native port of Fuwari's directive pipeline (Q12).
 * - `:::note|tip|important|warning|caution[optional label]` → titled blockquote
 * - `::github{repo="owner/name"}` → static link card shell (hydrated by one
 *   shared vanilla script; no per-card fetch at build time)
 * - `:spoiler[text]` → inline spoiler wrapper
 */
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
		const link: Link = {
			type: "link",
			url: `https://github.com/${full}`,
			title: null,
			children: [{ type: "text", value: full }],
		};
		const card: Paragraph = {
			type: "paragraph",
			children: [withProps(link, ["github-card-link"], { "data-repo": full })],
		};
		return withProps(card, ["github-card"]);
	},

	textDirective(node) {
		if (node.name !== "spoiler") return;
		const wrapper: Strong = { type: "strong", children: node.children };
		return withProps(wrapper, ["spoiler"]);
	},
});
