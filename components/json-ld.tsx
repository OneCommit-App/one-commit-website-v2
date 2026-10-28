import { faqPage, mobileApplication, serializeJsonLd } from "@/lib/structured-data"

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(mobileApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqPage) }}
      />
    </>
  )
}
