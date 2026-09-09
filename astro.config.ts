// @ts-check
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { defineConfig } from "astro/config";
import expressiveCode from "satteri-expressive-code";
import { directivesPlugin } from "./src/plugins/directives";
import siteConfig from "./site.config.json";
import { notoFontStack } from "./src/lib/fonts";

// https://astro.build/config
export default defineConfig({
	site: "https://l4ph.github.io",
	base: "/huwari",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { directive: true },
      mdastPlugins: [directivesPlugin],
      hastPlugins: [
        expressiveCode({
          themes: ["github-dark"],
          ...("fonts" in siteConfig && siteConfig.fonts === "noto" ? { styleOverrides: {
            codeFontFamily: notoFontStack,
            uiFontFamily: notoFontStack,
          } } : {}),
          plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
        }),
      ],
    }),
  },
});
