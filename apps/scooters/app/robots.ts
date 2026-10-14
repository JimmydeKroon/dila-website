import type { MetadataRoute } from "next";
import { scooters } from "@dila/content";

/**
 * Fully crawlable. Before this goes live, decide whether the draft should be
 * hidden from search engines during review — flipping `allow` to `disallow`
 * here is enough to keep it out of the index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${scooters.url}/sitemap.xml`,
    host: scooters.url,
  };
}
