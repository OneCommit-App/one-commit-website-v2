import AudiencePage from "@/components/b2b/audience-page"
import { audienceMetadata } from "@/lib/b2b-audiences"

export const metadata = audienceMetadata("coaches")

export default function CoachesPage() {
  return <AudiencePage audience="coaches" />
}
