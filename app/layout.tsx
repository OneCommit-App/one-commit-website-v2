import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/react"
import { appStoreId, hasConfiguredDownloadUrl } from "@/lib/download"
import { sharedOgImage, siteUrl } from "@/lib/page-metadata"
import "./globals.css"

const isVercelDeploy = process.env.VERCEL === "1"
const appAccessDescription = hasConfiguredDownloadUrl
  ? "Download OneCommit to build your Track & Field recruiting process with OneScore fit matching, own-inbox outreach, and reply tracking."
  : "Request a OneCommit beta invitation to build your Track & Field recruiting process with OneScore fit matching, own-inbox outreach, and reply tracking."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OneCommit — Personalized Track & Field Recruiting",
    template: "%s | OneCommit",
  },
  description: appAccessDescription,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/logo.png",
        type: "image/png",
        sizes: "1024x1024",
      },
    ],
  },
  openGraph: {
    title: "OneCommit — Personalized Track & Field Recruiting",
    description: appAccessDescription,
    url: siteUrl,
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [sharedOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneCommit — Personalized Track & Field Recruiting",
    description: appAccessDescription,
    images: [{ url: sharedOgImage.url, alt: sharedOgImage.alt }],
  },
  alternates: {
    canonical: siteUrl,
  },
  ...(appStoreId
    ? {
        itunes: {
          appId: appStoreId,
        },
      }
    : {}),
}

// Mobile browser chrome follows the page canvas in each scheme (--oc-bg in
// app/globals.css). Every public route now opens on the canvas, so nothing
// overrides this.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#06100c" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="overflow-x-hidden bg-background font-sans text-foreground antialiased">
        {children}
        {isVercelDeploy && <Analytics />}
      </body>
    </html>
  )
}
