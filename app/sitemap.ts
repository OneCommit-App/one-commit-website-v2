import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const launchModified = new Date("2026-06-23")
  const policyModified = new Date("2025-09-03")

  return [
    {
      url: "https://www.onecommit.us",
      lastModified: launchModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.onecommit.us/demo",
      lastModified: launchModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.onecommit.us/download",
      lastModified: launchModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://www.onecommit.us/support",
      lastModified: launchModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://www.onecommit.us/privacy",
      lastModified: policyModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://www.onecommit.us/terms",
      lastModified: policyModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
