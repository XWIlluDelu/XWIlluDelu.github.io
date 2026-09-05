import type { Blockquote, Link, Paragraph, Strong } from "mdast";
import { defineMdastPlugin } from "satteri";
import { admonitionTitle, isAdmonitionType, parseGithubRepo } from "@/lib/directives";

/** mdast types omit hProperties, but the converter reads them at runtime. */
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
