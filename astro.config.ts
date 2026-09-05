// @ts-check
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { defineConfig } from "astro/config";
import expressiveCode from "satteri-expressive-code";
import { directivesPlugin } from "./src/plugins/directives";

// https://astro.build/config
export default defineConfig({
  site: "https://huwari.example.com/",
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
          plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
        }),
      ],
    }),
  },
});
