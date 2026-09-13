import AudiencePage from "@/components/b2b/audience-page"
import { audienceMetadata } from "@/lib/b2b-audiences"
import { darkShellViewport } from "@/lib/dark-shell-viewport"

export const metadata = audienceMetadata("schools")

export const viewport = darkShellViewport

export default function SchoolsPage() {
  return <AudiencePage audience="schools" />
}
