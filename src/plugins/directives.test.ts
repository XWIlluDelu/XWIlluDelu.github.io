import { markdownToHtml } from "satteri";
import { describe, expect, test } from "vitest";
import { directivesPlugin } from "./directives";

async function render(source: string): Promise<string> {
	const result = await markdownToHtml(source, {
		features: { directive: true },
		mdastPlugins: [directivesPlugin],
	});
	return result.html;
}

describe("admonitions", () => {
	test("renders a titled blockquote for known types", async () => {
		const html = await render(":::note\nRemember this.\n:::");
		expect(html).toContain("admonition-note");
		expect(html).toContain("NOTE");
		expect(html).toContain("Remember this.");
	});

	test("prefers an explicit label", async () => {
		const html = await render(":::tip[Fast path]\nGo.\n:::");
		expect(html).toContain("admonition-tip");
		expect(html).toContain("Fast path");
	});

	test("leaves unknown containers alone", async () => {
		const html = await render(":::unknown\nHi.\n:::");
		expect(html).not.toContain("admonition-");
	});
});

describe("github cards", () => {
	test("renders a link card for owner/name", async () => {
		const html = await render('::github{repo="saicaca/fuwari"}');
		expect(html).toContain("https://github.com/saicaca/fuwari");
		expect(html).toContain("github-card");
	});

	test("drops malformed repos instead of linking", async () => {
		const html = await render('::github{repo="not-a-repo"}');
		expect(html).not.toContain("github.com");
	});
});

describe("spoilers", () => {
	test("wraps inline content without leaking the marker", async () => {
		const html = await render("The content :spoiler[is hidden]!");
		expect(html).toContain("spoiler");
		expect(html).toContain("is hidden");
		expect(html).not.toContain(":spoiler");
	});
});
