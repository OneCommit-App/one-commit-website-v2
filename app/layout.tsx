import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "OneCommit",
  description:
    "Get recruited faster for Track & Field. OneCommit turns your stats + preferences into matched schools, then helps you send outreach emails and track coach replies.",
  icons: {
    icon: "/logo.ico",
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
      <body className="font-sans antialiased overflow-x-hidden">{children}</body>
    </html>
  )
}
