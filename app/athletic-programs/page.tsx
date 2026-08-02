import AudiencePage from "@/components/b2b/audience-page"
import { audienceMetadata } from "@/lib/b2b-audiences"

export const metadata = audienceMetadata("athletic-programs")

export default function AthleticProgramsPage() {
  return <AudiencePage audience="athletic-programs" />
}
