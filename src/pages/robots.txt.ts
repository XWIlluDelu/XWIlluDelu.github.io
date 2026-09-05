import type { APIRoute } from "astro";
import { withBase } from "@/lib/urls";

const body = `User-agent: *
Disallow:

Sitemap: ${new URL(withBase("/sitemap-index.xml"), import.meta.env.SITE).href}
`;

export const GET: APIRoute = () => {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
