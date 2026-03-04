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
  metadataBase: new URL("https://onecommit.co"),
  title: {
    default: "OneCommit — Track & Field Recruiting Copilot",
    template: "%s | OneCommit",
  },
  description:
    "Get recruited faster for Track & Field. OneCommit matches you to colleges, writes personalized outreach emails, and tracks coach replies — free during beta.",
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "OneCommit — Track & Field Recruiting Copilot",
    description:
      "Match to colleges, send outreach emails coaches actually read, and track every reply. Free during beta.",
    url: "https://onecommit.co",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "OneCommit — Get recruited faster for Track & Field",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneCommit — Track & Field Recruiting Copilot",
    description:
      "Match to colleges, send outreach emails coaches actually read, and track every reply. Free during beta.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "https://onecommit.co",
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
