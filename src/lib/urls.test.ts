import { describe, expect, test } from "vitest";
import { categoryUrl, pathsEqual, postUrl, tagUrl } from "./urls";

describe("urls", () => {
  test("postUrl nests under /posts/ with trailing slash", () => {
    expect(postUrl("hello-world")).toBe("/posts/hello-world/");
  });

	test("tag and category links point at the filterable archive", () => {
		expect(tagUrl("Astro")).toBe("/archive/?tag=Astro");
		expect(categoryUrl("Guides")).toBe("/archive/?category=Guides");
	});

	test("empty tag falls back to the archive", () => {
		expect(tagUrl("")).toBe("/archive/");
	});

	test("empty category falls back to the uncategorized filter", () => {
		expect(categoryUrl("")).toBe("/archive/?uncategorized=true");
		expect(categoryUrl(null)).toBe("/archive/?uncategorized=true");
	});

  test("pathsEqual ignores trailing slashes and case", () => {
    expect(pathsEqual("/Posts/Hello/", "/posts/hello")).toBe(true);
    expect(pathsEqual("/a", "/b")).toBe(false);
  });
});
