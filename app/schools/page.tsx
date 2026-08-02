import AudiencePage from "@/components/b2b/audience-page"
import { audienceMetadata } from "@/lib/b2b-audiences"

export const metadata = audienceMetadata("schools")

export default function SchoolsPage() {
  return <AudiencePage audience="schools" />
}
