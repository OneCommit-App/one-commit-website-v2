import type { Metadata } from "next"

export const siteUrl = "https://www.onecommit.us"
export const sitemapUrl = `${siteUrl}/sitemap.xml`

/**
 * Alt text for the one shared Open Graph image (app/opengraph-image.tsx).
 * It has to describe that artwork. A page name here would be wrong, because
 * every route reuses the same image.
 */
export const sharedOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "OneCommit. Find the schools that fit. Then actually email them. Track and field recruiting, invite-only beta.",
} as const

type PageMetadataOptions = {
  title: string
  description: string
  /** Pathname including the leading slash, or "/" for the homepage. */
  path: `/${string}` | "/"
  openGraphTitle?: string
  openGraphDescription?: string
  twitterTitle?: string
  twitterDescription?: string
  /**
   * Public routes are indexable. The not-found page passes false so a missing
   * URL does not inherit the homepage's index, follow directive.
   */
  index?: boolean
}

export function pageMetadata({
  title,
  description,
  path,
  openGraphTitle,
  openGraphDescription,
  twitterTitle,
  twitterDescription,
  index = true,
}: PageMetadataOptions): Metadata {
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`
  const socialTitle = openGraphTitle ?? `${title} | OneCommit`
  const socialDescription = openGraphDescription ?? description

  return {
    title,
    description,
    ...(index ? { alternates: { canonical: url } } : {}),
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      ...(index ? { url } : {}),
      siteName: "OneCommit",
      locale: "en_US",
      type: "website",
      images: [sharedOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle ?? socialTitle,
      description: twitterDescription ?? socialDescription,
      images: [{ url: sharedOgImage.url, alt: sharedOgImage.alt }],
    },
  }
}
