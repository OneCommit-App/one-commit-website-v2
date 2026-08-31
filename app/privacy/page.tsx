import type { Metadata } from "next"
import Link from "next/link"
import FooterSection from "@/components/footer-section"
import PublicHeader from "@/components/public-header"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "OneCommit privacy policy -- how we collect, use, and protect your information.",
  alternates: { canonical: "https://www.onecommit.us/privacy" },
  openGraph: {
    title: "Privacy Policy | OneCommit",
    description: "How OneCommit collects, uses, and protects student-athlete information.",
    url: "https://www.onecommit.us/privacy",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OneCommit privacy policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | OneCommit",
    description: "How OneCommit collects, uses, and protects student-athlete information.",
    images: ["/opengraph-image"],
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f1a14] text-white">
      <PublicHeader accessSource="privacy_header" />
      <main id="main-content" tabIndex={-1} className="flex justify-center px-4 pb-20 pt-14 sm:pt-16">
        <article className="w-full max-w-3xl">
          <div className="mb-10 border-b border-white/[0.07] pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">Legal</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-sm text-white/55">Effective September 3, 2025 &middot; Last updated August 31, 2026</p>
          </div>

          {[
            { title: "Introduction", content: "Welcome to OneCommit! We understand that privacy is important to you and your family, especially when it comes to the college recruiting process. This Privacy Policy explains how OneCommit LLC (\"OneCommit,\" \"we,\" \"us,\" or \"our\") collects, uses, and protects your personal information when you use our website and related services (collectively, the \"Service\").\n\nSince our app is designed for high school Track & Field and Cross Country student-athletes, we've written this policy to be clear and understandable for both students and parents. We take the privacy of young users seriously and have implemented special protections for users under 18.\n\nBy using OneCommit, you agree to this Privacy Policy. If you do not agree with this policy, please do not use our Service." },
            { title: "Age Requirements and Parental Consent", content: "You must be at least 13 years old to use OneCommit. If you are between 13 and 17 years old, you must have your parent or guardian's permission to create an account. During registration, we may require parental consent verification for users under 18. Parents have the right to review and request deletion of their child's information. We do not knowingly collect information from children under 13 without parental consent." },
            { title: "Information We Collect", content: "When you create an account or use OneCommit, you may provide us with:\n\nProfile Information: Name, contact information, date of birth, city/state, high school, graduation year.\n\nAcademic Information: GPA, SAT/ACT, intended majors, academic achievements.\n\nAthletic Information: Sport(s), positions/events, performance stats/PRs, achievements, competition history.\n\nCollege Preferences: Regions/distance, division preferences (D1/D2/D3, etc.), school size, campus type, budget considerations.\n\nEmail Account Access: If you connect Gmail or Outlook, we access limited recruiting email data to send recruiting emails on your behalf, track replies from coaches/schools, and help draft follow-ups. Access is limited to recruiting-related threads; we do not store unrelated inbox content or full mailbox archives.\n\nVoice Interactions: If you choose voice onboarding with Riley (our AI assistant) and grant microphone permission, your audio is processed by our voice-AI provider to hold the conversation and generate a transcript. The transcript and captured profile details are stored on your device. When you confirm your profile, OneCommit also stores the transcript and confirmed profile details with your account to complete onboarding and support Riley features. A typed onboarding option is available if you prefer not to use voice." },
            { title: "Information Collected Automatically", content: "Device Information: Device type/model, OS/version, identifiers, network info.\nUsage Information: Features used, timestamps, performance metrics, error/crash logs." },
            { title: "Information We Don't Collect", content: "No third-party tracking cookies or ad beacons. No precise device geolocation. No access to photos, videos, contacts, or personal files without permission. No storage of unrelated inbox content or full mailbox archives." },
            { title: "How We Use Your Information", content: "Provide Our Core Service: account setup; school matching; AI-assisted email drafting; communication tracking; subscription processing if paid plans become available.\n\nImprove Our Service: Aggregate analytics to improve matching; feature usage understanding; accuracy and performance improvements.\n\nCommunicate With You: Service updates, support responses, account notices, and billing notices if paid plans become available.\n\nLegal and Safety: Compliance, fraud prevention, and enforcement of Terms." },
            { title: "How We Share Your Information", content: "With Your Direction: When you email coaches from your connected account.\n\nService Providers: Payments, email providers (Gmail/Outlook), cloud hosting, a voice-AI provider that processes audio to power Riley voice conversations, and AI assistants (no personal data stored by AI vendors beyond processing).\n\nLegal Reasons: Subpoena, court order, or lawful requests.\n\nBusiness Transfers: In a merger, acquisition, or asset sale.\n\nAnonymized Data: Aggregate stats/success stories that cannot identify you.\n\nWe do not sell or rent your personal information. We also do not share data with colleges unless you explicitly email them." },
            { title: "Data Security", content: "TLS/HTTPS in transit; encryption at rest. Secure cloud infrastructure; credential management; access controls and logging. Periodic security reviews and vulnerability assessments. No method of electronic transmission or storage is 100% secure; we cannot guarantee absolute security." },
            { title: "Data Breach Notification", content: "If a breach occurs, we will investigate, notify affected users within 72 hours where required, disclose scope/impact, steps taken, and guidance for protection, and cooperate with authorities when applicable." },
            { title: "Your Rights and Choices", content: "Access & Portability -- view and request a copy of your data.\nCorrection -- update inaccuracies.\nDeletion -- request deletion (legal/legitimate retention may apply).\nEmail Access -- disconnect Gmail/Outlook at any time.\nCommunication Preferences -- manage notifications, opt out of non-essential comms.\nParental Rights -- review, correct, delete, or withdraw consent for users under 18.\n\nContact: privacy@onecommit.us. We'll respond within 30 days." },
            { title: "Data Retention", content: "Active accounts -- retained while subscription is active.\nAfter cancellation -- personal data deleted within 3 months (subject to legal retention).\nAnonymized data may be retained indefinitely for service improvement." },
            { title: "Contact Us", content: "Privacy: privacy@onecommit.us\nSupport: admin@onecommit.us\n\n\u00a9 2026 OneCommit LLC. All rights reserved." },
          ].map((section, i) => (
            <section key={section.title} aria-labelledby={`privacy-section-${i}`} className="mb-8 scroll-mt-24">
              <h2 id={`privacy-section-${i}`} className="mb-3 text-xl font-semibold tracking-tight text-white">{section.title}</h2>
              <p className="whitespace-pre-line text-[0.9375rem] leading-7 text-white/70">{section.content}</p>
            </section>
          ))}

          <div className="mt-12 border-t border-white/[0.07] pt-6">
            <Link href="/" className="-mx-3 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#86efac] transition-colors hover:bg-white/[0.04] hover:text-[#bbf7d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]">&larr; Back to home</Link>
          </div>
        </article>
      </main>
      <FooterSection />
    </div>
  )
}
