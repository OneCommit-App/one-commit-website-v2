import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo | OneCommit",
  description: "Watch the OneCommit product demo. See how we turn your stats into matched schools, outreach emails, and reply tracking.",
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
