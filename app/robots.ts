import type { MetadataRoute } from "next"
import { siteUrl, sitemapUrl } from "@/lib/page-metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapUrl,
    host: siteUrl,
  }
}
