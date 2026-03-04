import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Watch OneCommit in action — see how we match you to colleges, generate outreach emails, and track coach replies.",
  openGraph: {
    title: "OneCommit Demo — See It in Action",
    description:
      "Watch how OneCommit matches you to colleges, writes outreach emails, and tracks coach replies.",
    images: [
      {
        url: "/og-default.png",
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
    images: ["/og-default.png"],
  },
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
