import { faqData } from "@/components/faq-data"

export default function JsonLd() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OneCommit",
    applicationCategory: "EducationalApplication",
    operatingSystem: "iOS, Android",
    description:
      "Self-service recruiting copilot for high school Track & Field athletes. Review OneScore matches, generate outreach emails, and track coach replies.",
    // The same price and rules as /terms section 7 (scripts/pass-copy.test.mjs).
    offers: {
      "@type": "Offer",
      name: "Recruiting Pass",
      price: "149.99",
      priceCurrency: "USD",
      description:
        "One payment, nothing renews. Covers the athlete through Aug 31 of their graduation year, or 90 days after purchase if that ends later. The first 3 coach emails are free.",
    },
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  )
}
