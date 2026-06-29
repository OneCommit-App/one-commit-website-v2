import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const isVercelDeploy = process.env.VERCEL === "1"

export const metadata: Metadata = {
  metadataBase: new URL("https://onecommit.us"),
  title: {
    default: "OneCommit — Personalized Track & Field Recruiting",
    template: "%s | OneCommit",
  },
  description:
    "Build your Track & Field recruiting process with matched colleges, own-inbox outreach, reply tracking, and planned advisor strategy support. Free tier available.",
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
    description:
      "Match to colleges, send stronger outreach, track replies, and join the waitlist for planned advisor strategy support. Free tier available.",
    url: "https://onecommit.us",
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
    description:
      "Match to colleges, send stronger outreach, track replies, and join the waitlist for planned advisor strategy support. Free tier available.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://onecommit.us",
  },
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
      <head />
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        {isVercelDeploy && <Analytics />}
      </body>
    </html>
  )
}
