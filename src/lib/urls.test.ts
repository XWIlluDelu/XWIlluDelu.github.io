import { describe, expect, test } from "vitest";
import { categoryUrl, pathsEqual, postUrl, tagUrl } from "./urls";

describe("urls", () => {
  test("postUrl nests under /posts/ with trailing slash", () => {
    expect(postUrl("hello-world")).toBe("/posts/hello-world/");
  });

  test("tag and category links point at pre-rendered listing pages", () => {
    expect(tagUrl("Astro")).toBe("/tags/astro/");
    expect(categoryUrl("Guides")).toBe("/categories/guides/");
  });

  test("empty tag falls back to the archive", () => {
    expect(tagUrl("")).toBe("/archive/");
  });

  test("pathsEqual ignores trailing slashes and case", () => {
    expect(pathsEqual("/Posts/Hello/", "/posts/hello")).toBe(true);
    expect(pathsEqual("/a", "/b")).toBe(false);
  });
});
