import { organization, serializeJsonLd } from "@/lib/structured-data"

export default function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }}
    />
  )
}
