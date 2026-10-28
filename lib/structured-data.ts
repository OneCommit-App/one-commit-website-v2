import { faqData } from "@/components/faq-data"
import { betaOffer } from "@/lib/pricing"

const siteUrl = "https://www.onecommit.us"

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "OneCommit",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  email: "admin@onecommit.us",
} as const

export const mobileApplication = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "@id": `${siteUrl}/#application`,
  name: "OneCommit",
  url: `${siteUrl}/download`,
  applicationCategory: "EducationalApplication",
  operatingSystem: "iOS, Android",
  description:
    "Self-service recruiting copilot for high school Track & Field athletes. Review OneScore matches, generate outreach emails, and track coach replies.",
  publisher: { "@id": organization["@id"] },
  offers: {
    "@type": "Offer",
    ...betaOffer,
    url: `${siteUrl}/download`,
  },
} as const

// Only emitted on the homepage, where these same FAQ answers are visible.
export const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl}/#faq`,
  mainEntity: faqData.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
} as const

// JSON-LD is embedded in a raw script element. Escaping '<' prevents a future
// FAQ answer containing '</script>' from breaking out into HTML.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}
