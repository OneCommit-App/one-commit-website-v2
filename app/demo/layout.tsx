import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Watch OneCommit in action — see how we match you to colleges, generate outreach emails, and track coach replies.",
  alternates: { canonical: "https://www.onecommit.us/demo" },
  openGraph: {
    title: "OneCommit Demo — See It in Action",
    description:
      "Watch how OneCommit matches you to colleges, writes outreach emails, and tracks coach replies.",
    url: "https://www.onecommit.us/demo",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OneCommit Demo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneCommit Demo — See It in Action",
    description:
      "Watch how OneCommit matches you to colleges, writes outreach emails, and tracks coach replies.",
    images: ["/opengraph-image"],
  },
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
