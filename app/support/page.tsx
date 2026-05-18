import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with OneCommit — contact our team, find answers to common questions, or learn how to manage your subscription.",
  alternates: { canonical: "https://onecommit.us/support" },
}

const supportSections = [
  {
    heading: "Contact us",
    body: (
      <>
        <p className="text-white/60 text-sm leading-relaxed mb-3">
          The fastest way to reach us is email. We typically respond within 24 hours, Monday through Friday.
        </p>
        <a
          href="mailto:admin@onecommit.us"
          className="inline-flex items-center gap-2 text-[#4ade80] text-sm font-semibold hover:underline"
        >
          admin@onecommit.us
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </a>
      </>
    ),
  },
  {
    heading: "Account & billing",
    body: (
      <ul className="text-white/60 text-sm leading-relaxed space-y-2 list-disc pl-4">
        <li>
          <strong className="text-white/80">Cancel your subscription:</strong> Tap your profile in the OneCommit iOS app, then "Manage Subscription," then "Cancel." You'll keep Pro access through the end of your current billing period.
        </li>
        <li>
          <strong className="text-white/80">Update payment method:</strong> Use the "Manage Subscription" link in the app to access your secure billing portal.
        </li>
        <li>
          <strong className="text-white/80">Refunds:</strong> Email <a href="mailto:admin@onecommit.us" className="text-[#4ade80] hover:underline">admin@onecommit.us</a> within 7 days of a charge and we'll review your request.
        </li>
        <li>
          <strong className="text-white/80">Delete your account:</strong> Email us and we'll permanently remove your profile, outreach history, and personal data within 30 days.
        </li>
      </ul>
    ),
  },
  {
    heading: "Getting started",
    body: (
      <ol className="text-white/60 text-sm leading-relaxed space-y-2 list-decimal pl-4">
        <li>Download OneCommit from the App Store and create an account.</li>
        <li>Complete your athlete profile — times, GPA, what you care about in a college.</li>
        <li>Connect your Gmail or Outlook account so emails go from your own inbox.</li>
        <li>Review your matched schools and start reaching out to coaches.</li>
        <li>Upgrade to Pro for unlimited outreach and a monthly 1-on-1 with a recruiting advisor.</li>
      </ol>
    ),
  },
  {
    heading: "Common questions",
    body: (
      <p className="text-white/60 text-sm leading-relaxed">
        Most product questions are answered on our{" "}
        <Link href="/#faq" className="text-[#4ade80] hover:underline">
          FAQ
        </Link>
        . If you can't find what you're looking for, email us at{" "}
        <a href="mailto:admin@onecommit.us" className="text-[#4ade80] hover:underline">
          admin@onecommit.us
        </a>{" "}
        and we'll get back to you.
      </p>
    ),
  },
  {
    heading: "Report a bug or request a feature",
    body: (
      <p className="text-white/60 text-sm leading-relaxed">
        We're a small team and we listen. Email{" "}
        <a href="mailto:admin@onecommit.us" className="text-[#4ade80] hover:underline">
          admin@onecommit.us
        </a>{" "}
        with a description and (if relevant) a screenshot. Bug reports get triaged within one business day.
      </p>
    ),
  },
  {
    heading: "Privacy & data",
    body: (
      <p className="text-white/60 text-sm leading-relaxed">
        We take privacy seriously. We don't share your profile, outreach, or coach replies with third parties.
        Read our full{" "}
        <Link href="/privacy" className="text-[#4ade80] hover:underline">
          Privacy Policy
        </Link>{" "}
        for details on what we collect, how we use it, and how to request deletion.
      </p>
    ),
  },
]

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0f1a14] text-white">
      <header className="px-4 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.ico" alt="OneCommit" width={24} height={24} className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
          </Link>
          <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <section className="px-4 pt-12 pb-8 flex justify-center">
        <div className="w-full max-w-3xl">
          <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">Help & Support</span>
          <h1 className="mt-2 text-white text-3xl sm:text-4xl font-bold tracking-tight">
            How can we help?
          </h1>
          <p className="mt-3 text-white/50 text-sm leading-relaxed max-w-xl">
            We're a small team building OneCommit for student-athletes. If you need help with the app, billing, or
            anything else — we're here.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 flex justify-center">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {supportSections.map((s, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6"
            >
              <h2 className="text-white text-base font-semibold mb-3">{s.heading}</h2>
              {s.body}
            </div>
          ))}

          <div className="mt-4 text-center">
            <p className="text-white/30 text-xs">
              OneCommit LLC · 2026 · Built for the overlooked.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
