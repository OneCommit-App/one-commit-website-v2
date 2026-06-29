import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join the Beta Waitlist",
  description:
    "Join the OneCommit beta waitlist for early access to Track & Field recruiting tools.",
  alternates: { canonical: "https://www.onecommit.us/waitlist" },
  openGraph: {
    title: "Join the OneCommit Beta Waitlist",
    description:
      "Get early access to OneCommit for Track & Field recruiting: matched schools, own-inbox outreach, and reply tracking.",
    url: "https://www.onecommit.us/waitlist",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Join the OneCommit Beta Waitlist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the OneCommit Beta Waitlist",
    description:
      "Get early access to OneCommit for Track & Field recruiting: matched schools, own-inbox outreach, and reply tracking.",
    images: ["/opengraph-image"],
  },
}

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
