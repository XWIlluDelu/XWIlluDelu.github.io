/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig(
  {
    test: {
      include: ["src/**/*.test.ts"],
    },
  },
  {
    site: "https://huwari.example.com/",
    trailingSlash: "always",
  },
);
