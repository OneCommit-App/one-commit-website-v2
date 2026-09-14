import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import FooterSection from "@/components/footer-section"
import { eyebrow, lede } from "@/components/home/tokens"
import PublicHeader from "@/components/public-header"
import RouteShell from "@/components/routes/route-shell"
import { h1, hero } from "@/components/routes/tokens"
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
  "inline-flex min-h-6 items-center rounded-sm px-0.5 font-medium text-green underline decoration-green/30 underline-offset-[3px] transition-colors hover:text-green-mid hover:decoration-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid"

const bodyClass = "text-[16px] leading-[1.65] text-ink-soft sm:text-[17px]"

const supportSections = [
  {
    heading: "Contact us",
    body: (
      <>
        <p className={`mb-4 ${bodyClass}`}>
          The fastest way to reach us is email. Send the issue, account email, and any useful screenshots.
        </p>
        <TrackedLink
          href="mailto:admin@onecommit.us"
          eventName="support_click"
          eventSource="support_contact"
          className="inline-flex h-12 min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-green px-6 text-[15px] font-semibold text-white shadow-cta transition-colors hover:bg-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          admin@onecommit.us
          <ArrowUpRight aria-hidden="true" size={15} />
        </TrackedLink>
      </>
    ),
  },
  {
    heading: "App access & account help",
    body: (
      <ul className={`list-disc space-y-3 pl-5 ${bodyClass}`}>
        <li>
          <strong className="font-semibold text-ink">Paid plans:</strong>{" "}
          {"None are active today. Invited core app access is free during the beta; availability depends on beta capacity and a supported app-access path. Future terms would appear before billing can start."}
        </li>
        <li>
          <strong className="font-semibold text-ink">Account changes:</strong>{" "}
          {"Email support if you need to change the email tied to your account."}
        </li>
        <li>
          <strong className="font-semibold text-ink">Future refunds:</strong> If a paid plan becomes available, email <TrackedLink href="mailto:admin@onecommit.us" eventName="support_click" eventSource="support_refunds" className={inlineLinkClass}>admin@onecommit.us</TrackedLink>{" "}
          {"within 7 days of a charge and we'll review your request. Refunds are discretionary unless required by law."}
        </li>
        <li>
          <strong className="font-semibold text-ink">Delete your account:</strong>{" "}
          {"Email us to request deletion. We remove personal data subject to legal, security, and operational retention requirements described in the Privacy Policy."}
        </li>
      </ul>
    ),
  },
  {
    heading: "Getting started",
    body: (
      <ol className={`list-decimal space-y-3 pl-5 ${bodyClass}`}>
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
      <p className={bodyClass}>
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
      <p className={bodyClass}>
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
      <p className={bodyClass}>
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
    <RouteShell>
      <PublicHeader accessSource="support_header" />
      <main id="main-content" tabIndex={-1}>
        <section aria-labelledby="support-heading" className={`${hero} pb-10 lg:pb-14`}>
          <div className="mx-auto w-full max-w-3xl">
            <p className={eyebrow}>Help &amp; Support</p>
            <h1 id="support-heading" className={`mt-5 ${h1}`}>
              How can we help?
            </h1>
            <p className={`mt-6 max-w-xl ${lede}`}>
              {"We're a small team building OneCommit for student-athletes. If you need help with app access, your account, or anything else — we're here."}
            </p>
          </div>
        </section>

        <section aria-label="Support topics" className="px-4 pb-24 sm:px-6 lg:pb-32">
          <div className="mx-auto w-full max-w-3xl border-t border-line">
            {supportSections.map((section) => (
              <section
                key={section.heading}
                className="grid gap-3 border-b border-line py-9 sm:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)] sm:gap-10"
              >
                <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">{section.heading}</h2>
                <div>{section.body}</div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </RouteShell>
  )
}
