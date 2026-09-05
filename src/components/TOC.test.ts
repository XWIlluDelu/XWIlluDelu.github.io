import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, test } from "vitest";
import TOC from "./TOC.astro";

describe("TOC", () => {
  test("renders anchor links for headings within depth", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TOC, {
      props: {
        headings: [
          { depth: 2, slug: "getting-started", text: "Getting started" },
          { depth: 3, slug: "install", text: "Install" },
          { depth: 4, slug: "too-deep", text: "Too deep" },
        ],
      },
    });
    expect(html).toContain('href="#getting-started"');
    expect(html).toContain('href="#install"');
    expect(html).not.toContain("too-deep");
  });

  test("renders nothing without headings", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(TOC, {
      props: { headings: [] },
    });
    expect(html).not.toContain("Table of contents");
  });
});
