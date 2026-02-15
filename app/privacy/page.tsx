import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | OneCommit",
  description: "OneCommit privacy policy -- how we collect, use, and protect your information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f1a14]">
      <nav className="flex justify-center px-4 pt-6 pb-8">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.ico" alt="OneCommit logo" className="w-6 h-6 rounded-full" />
          <span className="text-white text-sm font-semibold">OneCommit</span>
        </Link>
      </nav>
      <main className="px-4 pb-16 flex justify-center">
        <article className="w-full max-w-2xl prose-sm">
          <h1 className="text-white text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-white/40 text-sm mb-8">Effective Date: September 3, 2025 &middot; Last Updated: September 3, 2025</p>

          {[
            { title: "Introduction", content: "Welcome to OneCommit! We understand that privacy is important to you and your family, especially when it comes to the college recruiting process. This Privacy Policy explains how OneCommit LLC (\"OneCommit,\" \"we,\" \"us,\" or \"our\") collects, uses, and protects your personal information when you use our website, mobile application, and services (collectively, the \"Service\").\n\nSince our app is designed for high school student-athletes across various sports, we've written this policy to be clear and understandable for both students and parents. We take the privacy of young users seriously and have implemented special protections for users under 18.\n\nBy using OneCommit, you agree to this Privacy Policy. If you do not agree with this policy, please do not use our Service." },
            { title: "Age Requirements and Parental Consent", content: "You must be at least 13 years old to use OneCommit. If you are between 13 and 17 years old, you must have your parent or guardian's permission to create an account. During registration, we may require parental consent verification for users under 18. Parents have the right to review and request deletion of their child's information. We do not knowingly collect information from children under 13 without parental consent." },
            { title: "Information We Collect", content: "When you create an account and use OneCommit, you provide us with:\n\nProfile Information: Name, contact information, date of birth, city/state, high school, graduation year.\n\nAcademic Information: GPA, SAT/ACT, intended majors, academic achievements.\n\nAthletic Information: Sport(s), positions/events, performance stats/PRs, achievements, competition history.\n\nCollege Preferences: Regions/distance, division preferences (D1/D2/D3, etc.), school size, campus type, budget considerations.\n\nEmail Account Access: If you connect Gmail or Outlook, we access limited email data to send recruiting emails on your behalf, track replies from coaches/schools, and help draft follow-ups. Access is limited to recruiting-related threads; we do not store full email content." },
            { title: "Information Collected Automatically", content: "Device Information: Device type/model, OS/version, identifiers, network info.\nUsage Information: Features used, timestamps, performance metrics, error/crash logs." },
            { title: "Information We Don't Collect", content: "No third-party tracking cookies or ad beacons. No precise device geolocation. No access to photos, videos, contacts, or personal files without permission. No storage of full email content." },
            { title: "How We Use Your Information", content: "Provide Our Core Service: School matching; AI-assisted email drafting; communication tracking; subscription processing.\n\nImprove Our Service: Aggregate analytics to improve matching; feature usage understanding; accuracy and performance improvements.\n\nCommunicate With You: Service updates, support responses, billing notices.\n\nLegal and Safety: Compliance, fraud prevention, and enforcement of Terms." },
            { title: "How We Share Your Information", content: "With Your Direction: When you email coaches from your connected account.\n\nService Providers: Payments, email providers (Gmail/Outlook), cloud hosting, and AI assistants (no personal data stored by AI vendors beyond processing).\n\nLegal Reasons: Subpoena, court order, or lawful requests.\n\nBusiness Transfers: In a merger, acquisition, or asset sale.\n\nAnonymized Data: Aggregate stats/success stories that cannot identify you.\n\nWe do not sell or rent your personal information. We also do not share data with colleges unless you explicitly email them." },
            { title: "Data Security", content: "TLS/HTTPS in transit; encryption at rest. Secure cloud infrastructure; credential management; access controls and logging. Periodic security reviews and vulnerability assessments. No method of electronic transmission or storage is 100% secure; we cannot guarantee absolute security." },
            { title: "Data Breach Notification", content: "If a breach occurs, we will investigate, notify affected users within 72 hours where required, disclose scope/impact, steps taken, and guidance for protection, and cooperate with authorities when applicable." },
            { title: "Your Rights and Choices", content: "Access & Portability -- view and request a copy of your data.\nCorrection -- update inaccuracies.\nDeletion -- request deletion (legal/legitimate retention may apply).\nEmail Access -- disconnect Gmail/Outlook at any time.\nCommunication Preferences -- manage notifications, opt out of non-essential comms.\nParental Rights -- review, correct, delete, or withdraw consent for users under 18.\n\nContact: privacy@onecommit.us. We'll respond within 30 days." },
            { title: "Data Retention", content: "Active accounts -- retained while subscription is active.\nAfter cancellation -- personal data deleted within 3 months (subject to legal retention).\nAnonymized data may be retained indefinitely for service improvement." },
            { title: "Contact Us", content: "Privacy: privacy@onecommit.us\nSupport: support@onecommit.us\n\n\u00a9 2025 OneCommit LLC. All rights reserved." },
          ].map((section, i) => (
            <div key={i} className="mb-6">
              <h2 className="text-white text-lg font-semibold mb-2">{section.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}

          <div className="mt-10 pt-6 border-t border-white/[0.06]">
            <Link href="/" className="text-[#4ade80] text-sm font-medium hover:underline">&larr; Back to home</Link>
          </div>
        </article>
      </main>
    </div>
  )
}
