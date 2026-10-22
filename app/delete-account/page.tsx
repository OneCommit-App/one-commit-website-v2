import type { Metadata } from "next"
import Link from "next/link"
import FooterSection from "@/components/footer-section"
import PublicHeader from "@/components/public-header"
import LegalArticle, { type LegalSection } from "@/components/routes/legal-article"
import RouteShell from "@/components/routes/route-shell"
import { inlineLink } from "@/components/routes/tokens"

export const metadata: Metadata = {
  title: "Delete your account",
  description:
    "Delete a OneCommit account in the app, or email the privacy contact to request deletion. Retention limits match the privacy policy.",
  alternates: { canonical: "https://www.onecommit.us/delete-account" },
  openGraph: {
    title: "Delete your account | OneCommit",
    description:
      "How to delete a OneCommit account in the app or by email, and what the privacy policy says is deleted or retained.",
    url: "https://www.onecommit.us/delete-account",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Delete your OneCommit account",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete your account | OneCommit",
    description:
      "How to delete a OneCommit account in the app or by email, and what the privacy policy says is deleted or retained.",
    images: ["/opengraph-image"],
  },
}

/* Retention lines are copied from the privacy policy. Do not add a period the policy does not state. */
const sections: LegalSection[] = [
  {
    title: "Delete in the app",
    content: "Open the OneCommit app and go to Me › Settings › Delete account.",
  },
  {
    title: "Request deletion without the app",
    content: (
      <>
        <p>
          If you do not have the app, email{" "}
          <a href="mailto:privacy@onecommit.us" className={inlineLink}>
            privacy@onecommit.us
          </a>{" "}
          and ask for the account to be deleted. Support requests can go to{" "}
          <a href="mailto:admin@onecommit.us" className={inlineLink}>
            admin@onecommit.us
          </a>
          . Both addresses are listed on the Privacy Policy.
        </p>
        <p className="mt-4">{"Contact: privacy@onecommit.us. We'll respond within 30 days."}</p>
        <p className="mt-4">
          {"Parents have the right to review and request deletion of their child's information."}
        </p>
      </>
    ),
  },
  {
    title: "What is deleted and what is retained",
    content:
      "Deletion -- request deletion (legal/legitimate retention may apply).\n\nActive accounts -- retained while subscription is active.\nAfter cancellation -- personal data deleted within 3 months (subject to legal retention).\nAnonymized data may be retained indefinitely for service improvement.",
  },
]

export default function DeleteAccountPage() {
  return (
    <RouteShell>
      <PublicHeader accessSource="delete_account_header" />
      <main id="main-content" tabIndex={-1} className="px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:pb-32">
        <LegalArticle
          title="Delete your account"
          meta="Retention limits below are from the Privacy Policy last updated August 31, 2026."
          idPrefix="delete-account"
          sections={sections}
        >
          <p>
            These limits are stated in the{" "}
            <Link href="/privacy" className={inlineLink}>
              Privacy Policy
            </Link>
            .
          </p>
        </LegalArticle>
      </main>
      <FooterSection />
    </RouteShell>
  )
}
