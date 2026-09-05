import { describe, expect, test } from "vitest";
import { attachPrevNext, slugFromId, sortPostsByPublishedDesc } from "./posts";
import type { PostMeta } from "./posts";

function meta(slug: string, published: string, title = slug): PostMeta {
	return { slug, title, published: new Date(published) };
}

describe("sortPostsByPublishedDesc", () => {
	test("sorts newest first without mutating the input", () => {
		const input = [meta("old", "2024-01-01"), meta("new", "2024-06-01")];
		const sorted = sortPostsByPublishedDesc(input);
		expect(sorted.map((p) => p.slug)).toEqual(["new", "old"]);
		expect(input[0].slug).toBe("old");
	});
});

describe("slugFromId", () => {
	test("strips the extension and collapses trailing index", () => {
		expect(slugFromId("hello-world.md")).toBe("hello-world");
		expect(slugFromId("guide/index.md")).toBe("guide");
	});
});

describe("attachPrevNext", () => {
	test("links neighbours so templates never read the content layer for navigation", () => {
		const sorted = sortPostsByPublishedDesc([
			meta("a", "2024-01-01", "A"),
			meta("b", "2024-02-01", "B"),
			meta("c", "2024-03-01", "C"),
		]);
		const withNav = attachPrevNext(sorted);
		// Newest (c) has no next; oldest (a) has no prev.
		expect(withNav[0]).toMatchObject({
			slug: "c",
			prevSlug: "b",
			nextSlug: undefined,
		});
		expect(withNav[1]).toMatchObject({
			slug: "b",
			prevSlug: "a",
			nextSlug: "c",
		});
		expect(withNav[2]).toMatchObject({
			slug: "a",
			prevSlug: undefined,
			nextSlug: "b",
		});
	});
});
