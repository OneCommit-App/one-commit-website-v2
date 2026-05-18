import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import JsonLd from "@/components/json-ld"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://onecommit.us"),
  title: {
    default: "OneCommit — Personalized Track & Field Recruiting",
    template: "%s | OneCommit",
  },
  description:
    "Get recruited for Track & Field with a real advisor in your corner. Match to colleges, send outreach coaches actually read, track every reply — and meet 1-on-1 with a recruiting advisor each month. Free tier available.",
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "OneCommit — Personalized Track & Field Recruiting",
    description:
      "Match to colleges, send outreach coaches actually read, track replies, and meet monthly with a real recruiting advisor. From $7.99/mo.",
    url: "https://onecommit.us",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-default.png",
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
      "Match to colleges, send outreach coaches read, track replies, meet monthly with a real recruiting advisor. From $7.99/mo.",
    images: ["/og-default.png"],
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
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
