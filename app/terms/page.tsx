import type { Metadata } from "next"
import FooterSection from "@/components/footer-section"
import PublicHeader from "@/components/public-header"
import LegalArticle, { type LegalSection } from "@/components/routes/legal-article"
import RouteShell from "@/components/routes/route-shell"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "OneCommit terms of service governing your use of the platform.",
  alternates: { canonical: "https://www.onecommit.us/terms" },
  openGraph: {
    title: "Terms of Service | OneCommit",
    description: "Terms governing use of the OneCommit recruiting platform.",
    url: "https://www.onecommit.us/terms",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OneCommit terms of service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | OneCommit",
    description: "Terms governing use of the OneCommit recruiting platform.",
    images: ["/opengraph-image"],
  },
}

/* Terms text is rendered verbatim; edit the wording only with a matching sitemap revision. */
const sections: LegalSection[] = [
            { title: "1. Agreement to Terms", content: "These Terms of Service (\"Terms\") govern your access to and use of the OneCommit website and related services (collectively, the \"Service\") operated by OneCommit LLC (\"OneCommit,\" \"we,\" \"us,\" or \"our\"). By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy." },
            { title: "2. Eligibility; Accounts", content: "You must be at least 13 years old to use the Service. If you are 13-17, you represent that you have permission from a parent or legal guardian, who also agrees to these Terms on your behalf.\n\nYou agree to provide accurate, current, and complete information during registration and to keep it updated. You are responsible for safeguarding your login credentials and for all activity under your account." },
            { title: "3. Description of Service", content: "OneCommit is an athlete-first recruiting copilot. Features may include: (a) school matching based on athletic, academic, and profile inputs; (b) email drafting and sending through your connected email account — Outlook/Microsoft 365 is currently the only inbox option offered in the beta app, and Gmail is not currently available; (c) engagement analytics that may include opens and replies; (d) organizing recruiting tasks and timelines; and (e) dashboards and recommendations.\n\nNo advisor subscription or recurring call package is part of the current beta. If optional human services are offered later, their scope and separate terms will be presented before purchase.\n\nWe may add, change, or remove features at any time, including during beta. We may throttle or limit usage (e.g., email volume) to protect deliverability and platform integrity." },
            { title: "4. Connecting Email Accounts", content: "When you connect a supported email account, you authorize OneCommit to send recruiting emails on your behalf and to process limited recruiting email data, including message metadata and relevant recruiting thread content when needed for analytics and follow-ups.\n\nWe do not store unrelated inbox content or full mailbox archives; see the Privacy Policy for details. You can disconnect at any time in settings or via your provider's security dashboard." },
            { title: "5. Student-Athlete Compliance", content: "You are solely responsible for understanding and complying with all applicable recruiting rules (e.g., NCAA/NAIA/NJCAA, high-school association rules, and institutional policies).\n\nOneCommit is not a legal advisor or compliance authority. We provide tools; we do not guarantee eligibility or outcomes." },
            { title: "6. Acceptable Use", content: "No unlawful, deceptive, harassing, hateful, or abusive content or conduct.\nNo spam or unsolicited mass outreach beyond reasonable recruiting purposes. Respect coach communication rules and quiet periods.\nNo attempts to breach security, probe systems, or disrupt the Service.\nNo scraping or reverse-engineering except as permitted by law.\nNo use that infringes third-party rights (IP, privacy, publicity, contract)." },
            { title: "7. The Recruiting Pass, Payments, and Refunds", content: "The Recruiting Pass is a one-time purchase of $149.99. It never renews, and we never charge for it again.\n\nThe pass covers the athlete's account through August 31 of the athlete's high school graduation year (the class year in the app), or for 90 days from purchase if that ends later. The end date is set when the purchase is recorded and does not change.\n\nThe athlete can buy the pass in the app through the App Store, or a parent or guardian can pay for it on our website through Stripe. A parent paying on our website must confirm they are the athlete's parent or guardian. We do not sell the pass after August 31 of the athlete's graduation year, or after the athlete logs a college commitment in the app.\n\nBefore buying, an athlete can send their first 3 coach emails free.\n\nRefunds. Apple handles refunds for App Store purchases under Apple's rules; ask Apple for those. For a payment made on our website, email admin@onecommit.us within 14 days of the payment and we will refund it in full. After 14 days, website payments are not refundable except where the law requires. A full refund ends the pass. A chargeback ends it too.\n\nIf the athlete logs a commitment in the app before a parent's website payment goes through, we refund that payment in full automatically and no pass is added. We do the same if the athlete is already covered, or if the athlete's account was deleted first. A commitment logged after the pass is on the account does not end the pass or lead to a refund.\n\nIf you have an earlier monthly or yearly plan, it keeps renewing until you turn renewal off. The pass can't be bought until then, or, for an App Store plan, until that plan ends.\n\nTaxes may apply where the law requires. You authorize the payment processor (Stripe on our website, or Apple in the App Store) to charge the payment method you choose." },
            { title: "8. Coach Communications & Deliverability", content: "You understand email deliverability is influenced by many factors (sender reputation, content, recipient filters). We cannot guarantee delivery, opens, or replies.\n\nYou are responsible for the content of outreach and for honoring opt-out/\"do not contact\" requests." },
            { title: "9. Content; License to OneCommit", content: "You retain ownership of content you submit (metrics, profile, emails, preferences). You grant OneCommit a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content solely to provide and improve the Service.\n\nYou represent that you have all necessary rights to your content and that it does not violate law or third-party rights." },
            { title: "10. Intellectual Property", content: "The Service, including all software, designs, text, graphics, logos, and trademarks (excluding your content), are owned by or licensed to OneCommit and are protected by intellectual-property laws. No rights are granted except as expressly stated in these Terms." },
            { title: "11. Feedback", content: "You may submit ideas or suggestions. By doing so, you grant OneCommit a perpetual, irrevocable, worldwide, royalty-free license to use them without restriction or compensation." },
            { title: "12. Third-Party Services", content: "The Service may integrate third-party services (e.g., email providers, payment providers, cloud hosting, AI services). Your use of such services is subject to their terms and policies. We are not responsible for third-party actions or outages." },
            { title: "13. Beta Features; Disclaimers", content: "Beta or experimental features may be offered \"as is\" with reduced or different reliability and support.\n\nAI-assisted features generate drafts and recommendations; you must review for accuracy, appropriateness, and compliance before sending." },
            { title: "14. Disclaimers", content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE,\" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR MEET YOUR REQUIREMENTS, NOR DO WE GUARANTEE ANY RECRUITING OUTCOMES." },
            { title: "15. Limitation of Liability", content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL ONECOMMIT LLC BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES (INCLUDING LOSS OF DATA, PROFITS, OR GOODWILL), OR FOR DAMAGES EXCEEDING THE AMOUNTS YOU PAID TO ONECOMMIT IN THE 12 MONTHS PRECEDING THE CLAIM." },
            { title: "16. Indemnification", content: "You agree to defend, indemnify, and hold harmless OneCommit LLC and its affiliates, officers, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or in any way connected with your use of the Service, your content, or your violation of these Terms or applicable law." },
            { title: "17. Termination", content: "We may suspend or terminate your access to the Service at any time, with or without notice, for conduct that we believe violates these Terms, harms other users, or risks the integrity of the platform. You may stop using the Service at any time. Certain provisions survive termination." },
            { title: "18. Governing Law; Venue", content: "These Terms are governed by the laws of the State of Ohio, without regard to conflict-of-laws principles. Subject to Section 19 (Arbitration), the exclusive venue for any action shall be the state or federal courts located in Ohio." },
            { title: "19. Dispute Resolution; Binding Arbitration", content: "Any dispute arising out of or relating to these Terms or the Service shall be resolved by binding arbitration administered by the American Arbitration Association under its applicable rules. YOU WAIVE THE RIGHT TO A JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION." },
            { title: "20. Changes to Terms", content: "We may modify the Service or these Terms at any time. When we make material changes, we will provide reasonable notice (e.g., in-app notice or email). Continued use after changes become effective constitutes acceptance of the updated Terms." },
            { title: "21. Severability; Assignment; Entire Agreement", content: "If any provision is held unenforceable, the remainder will remain in effect. You may not assign or transfer these Terms without our consent; we may assign them as part of a merger, acquisition, or sale of assets. These Terms, together with policies referenced herein, are the entire agreement between you and OneCommit regarding the Service." },
            { title: "22. Contact", content: "Questions about these Terms? Email admin@onecommit.us." },
]

export default function TermsPage() {
  return (
    <RouteShell>
      <PublicHeader accessSource="terms_header" />
      <main id="main-content" tabIndex={-1} className="px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:pb-32">
        <LegalArticle
          title="Terms of Service"
          meta="Effective September 3, 2025 · Last updated October 21, 2026"
          idPrefix="terms"
          sections={sections}
        />
      </main>
      <FooterSection />
    </RouteShell>
  )
}
