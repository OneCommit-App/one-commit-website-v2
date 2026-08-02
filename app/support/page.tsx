import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import FooterSection from "@/components/footer-section"
import PublicHeader from "@/components/public-header"
import TrackedLink from "@/components/tracked-link"

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with OneCommit — contact our team, find answers to common questions, or manage app access and account requests.",
  alternates: { canonical: "https://www.onecommit.us/support" },
  openGraph: {
    title: "Support | OneCommit",
    description:
      "Contact OneCommit support, find answers to common questions, and get help with app access or account requests.",
    url: "https://www.onecommit.us/support",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OneCommit support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support | OneCommit",
    description:
      "Contact OneCommit support, find answers to common questions, and get help with app access or account requests.",
    images: ["/opengraph-image"],
  },
}

const inlineLinkClass =
  "inline-flex min-h-6 items-center rounded-sm px-0.5 font-medium text-[#86efac] underline-offset-2 hover:text-[#bbf7d0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"

const supportSections = [
  {
    heading: "Contact us",
    body: (
      <>
        <p className="mb-3 text-sm leading-relaxed text-white/70">
          The fastest way to reach us is email. Send the issue, account email, and any useful screenshots.
        </p>
        <TrackedLink
          href="mailto:admin@onecommit.us"
          eventName="support_click"
          eventSource="support_contact"
          className="-mx-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#86efac] hover:bg-white/[0.04] hover:text-[#bbf7d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"
        >
          admin@onecommit.us
          <ArrowUpRight aria-hidden="true" size={14} />
        </TrackedLink>
      </>
    ),
  },
  {
    heading: "App access & account help",
    body: (
      <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-white/70">
        <li>
          <strong className="text-white/80">Paid plans:</strong>{" "}
          {"None are active today. Invited core app access is free during the beta; availability depends on beta capacity and a supported app-access path. Future terms would appear before billing can start."}
        </li>
        <li>
          <strong className="text-white/80">Account changes:</strong>{" "}
          {"Email support if you need to change the email tied to your account."}
        </li>
        <li>
          <strong className="text-white/80">Future refunds:</strong> If a paid plan becomes available, email <TrackedLink href="mailto:admin@onecommit.us" eventName="support_click" eventSource="support_refunds" className={inlineLinkClass}>admin@onecommit.us</TrackedLink>{" "}
          {"within 7 days of a charge and we'll review your request. Refunds are discretionary unless required by law."}
        </li>
        <li>
          <strong className="text-white/80">Delete your account:</strong>{" "}
          {"Email us to request deletion. We remove personal data subject to legal, security, and operational retention requirements described in the Privacy Policy."}
        </li>
      </ul>
    ),
  },
  {
    heading: "Getting started",
    body: (
      <ol className="list-decimal space-y-2 pl-4 text-sm leading-relaxed text-white/70">
        <li>After receiving an invitation, create your beta account.</li>
        <li>Complete your athlete profile — times, GPA, what you care about in a college.</li>
        <li>Outlook/Microsoft 365 is currently the only inbox option offered in the beta app. Gmail is not currently available.</li>
        <li>Review your D3-focused OneScore matches and start reaching out to coaches.</li>
        <li>Use in-app help or email support if access, profile, or inbox setup gets stuck.</li>
      </ol>
    ),
  },
  {
    heading: "Common questions",
    body: (
      <p className="text-sm leading-relaxed text-white/70">
        Most product questions are answered on our{" "}
        <Link href="/#faq" className={inlineLinkClass}>
          FAQ
        </Link>
        {". If you can't find what you're looking for, email us at "}
        <TrackedLink href="mailto:admin@onecommit.us" eventName="support_click" eventSource="support_common_questions" className={inlineLinkClass}>
          admin@onecommit.us
        </TrackedLink>
        {" and we'll get back to you."}
      </p>
    ),
  },
  {
    heading: "Report a bug or request a feature",
    body: (
      <p className="text-sm leading-relaxed text-white/70">
        {"We're a small team and we listen. Email "}
        <TrackedLink href="mailto:admin@onecommit.us" eventName="support_click" eventSource="support_bug_report" className={inlineLinkClass}>
          admin@onecommit.us
        </TrackedLink>{" "}
        with a description and (if relevant) a screenshot.
      </p>
    ),
  },
  {
    heading: "Privacy & data",
    body: (
      <p className="text-sm leading-relaxed text-white/70">
        {"We take privacy seriously. We don't sell or rent your profile, outreach, or coach replies. Read our full "}
        <Link href="/privacy" className={inlineLinkClass}>
          Privacy Policy
        </Link>{" "}
        for details on what we collect, how we use it, and how to request deletion.
      </p>
    ),
  },
]

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0f1a14] text-white">
      <PublicHeader accessSource="support_header" />
      <main id="main-content" tabIndex={-1}>
      <section aria-labelledby="support-heading" className="flex justify-center px-4 pb-8 pt-14 sm:pt-16">
        <div className="w-full max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">Help &amp; Support</span>
          <h1 id="support-heading" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How can we help?
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            {"We're a small team building OneCommit for student-athletes. If you need help with app access, your account, or anything else — we're here."}
          </p>
        </div>
      </section>

      <section aria-label="Support topics" className="flex justify-center px-4 pb-20">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {supportSections.map((section) => (
            <section
              key={section.heading}
              className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 sm:p-6"
            >
              <h2 className="mb-3 text-lg font-semibold tracking-tight text-white">{section.heading}</h2>
              {section.body}
            </section>
          ))}
        </div>
      </section>
      </main>
      <FooterSection />
    </div>
  )
}
