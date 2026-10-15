import type { MetadataRoute } from "next";
import { brands, scooters } from "@dila/content";

/**
 * Required by `output: "export"` — a route handler has to declare that it is
 * static or the build fails. See the note in `next.config.ts`.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: scooters.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...brands.map((brand) => ({
      url: `${scooters.url}/brands/${brand.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
