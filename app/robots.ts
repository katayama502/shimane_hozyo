import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Query-parameter search results are duplicate content; the canonical
        // LPs at /areas/[slug] and /purposes/[slug] carry the indexable content.
        disallow: "/subsidies?*",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
