import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { appStoreId, hasConfiguredDownloadUrl } from "@/lib/download"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const isVercelDeploy = process.env.VERCEL === "1"
const appAccessDescription = hasConfiguredDownloadUrl
  ? "Download OneCommit to build your Track & Field recruiting process with D3-focused OneScore matches, own-inbox outreach, and reply tracking."
  : "Get OneCommit beta app access to build your Track & Field recruiting process with D3-focused OneScore matches, own-inbox outreach, and reply tracking."

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

export const viewport: Viewport = {
  themeColor: "#0f1a14",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        {isVercelDeploy && <Analytics />}
      </body>
    </html>
  )
}
