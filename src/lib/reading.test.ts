import { describe, expect, test } from "vitest";
import { computeReadingStats, excerptOfMarkdown } from "./reading";

describe("computeReadingStats", () => {
  test("empty text yields zero words and a minimum of one minute", () => {
    expect(computeReadingStats("")).toEqual({ words: 0, minutes: 1 });
  });

  test("400 words at 200wpm yields two minutes", () => {
    const text = Array(400).fill("word").join(" ");
    expect(computeReadingStats(text)).toEqual({ words: 400, minutes: 2 });
  });
});

describe("excerptOfMarkdown", () => {
  test("uses the first non-empty paragraph", () => {
    const md = "# Title\n\nFirst paragraph here.\n\nSecond paragraph.";
    expect(excerptOfMarkdown(md)).toBe("First paragraph here.");
  });

  test("truncates long excerpts with an ellipsis", () => {
    const md = `Long ${"word ".repeat(100)}`;
    const excerpt = excerptOfMarkdown(md, 20);
    expect(excerpt.length).toBeLessThanOrEqual(21);
    expect(excerpt.endsWith("…")).toBe(true);
  });
});
