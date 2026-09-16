import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/react"
import { appStoreId, hasConfiguredDownloadUrl } from "@/lib/download"
import "./globals.css"

const isVercelDeploy = process.env.VERCEL === "1"
const appAccessDescription = hasConfiguredDownloadUrl
  ? "Download OneCommit to build your Track & Field recruiting process with D3-focused OneScore matches, own-inbox outreach, and reply tracking."
  : "Request a OneCommit beta invitation to build your Track & Field recruiting process with D3-focused OneScore matches, own-inbox outreach, and reply tracking."

export const metadata: Metadata = {
  metadataBase: new URL("https://www.onecommit.us"),
  title: {
    default: "OneCommit — Personalized Track & Field Recruiting",
    template: "%s | OneCommit",
  },
  description: appAccessDescription,
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
    url: "https://www.onecommit.us",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OneCommit — Personalized Track & Field Recruiting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneCommit — Personalized Track & Field Recruiting",
    description: appAccessDescription,
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://www.onecommit.us",
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
// app/globals.css). Routes that open on the deep-green band override this with
// lib/dark-shell-viewport.ts.
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
