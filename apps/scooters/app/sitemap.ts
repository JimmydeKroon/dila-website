import type { MetadataRoute } from "next";
import { brands, scooters } from "@dila/content";

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
