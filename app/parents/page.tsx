import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import DeviceFrame from "@/components/device-frame"
import DownloadLink from "@/components/download-link"
import FooterSection from "@/components/footer-section"
import { container, eyebrow, h2, lede, pillPrimary, section } from "@/components/home/tokens"
import PublicHeader from "@/components/public-header"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import RouteShell from "@/components/routes/route-shell"
import { h1, hero, inlineLink, prose } from "@/components/routes/tokens"

export const metadata: Metadata = {
  title: "For parents",
  description:
    "What your athlete actually does inside OneCommit, what OneCommit does not do, and what it costs during the beta.",
  alternates: { canonical: "https://www.onecommit.us/parents" },
  openGraph: {
    title: "For parents | OneCommit",
    description:
      "What your athlete actually does inside OneCommit, what OneCommit does not do, and what it costs during the beta.",
    url: "https://www.onecommit.us/parents",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "OneCommit for parents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "For parents | OneCommit",
    description:
      "What your athlete actually does inside OneCommit, what OneCommit does not do, and what it costs during the beta.",
    images: ["/opengraph-image"],
  },
}

/* Each line describes a screen that ships today (public/app/brief.png, home.png). */
const theDay = [
  {
    title: "A short list, dated",
    body: "The app opens on today's date with a few things to do — review new matches, prepare a note to a program, log a race result. Each one carries a time estimate.",
  },
  {
    title: "They write the emails",
    body: "OneCommit drafts outreach from what your athlete told it about themselves and about that specific program. They read it, change it, and decide whether it goes.",
  },
  {
    title: "It sends from their own inbox",
    body: "Messages leave from your athlete's own connected mailbox, so a coach replying writes back to them directly. The conversation is theirs, not ours.",
  },
  {
    title: "Replies stay in one place",
    body: "Saved schools, messages sent, and replies received are counted in one queue, so nobody has to reconstruct where things stand from memory.",
  },
]

const doesNot = [
  "Promise admission, a roster spot, a coach reply, or any recruiting outcome.",
  "Send anything without your athlete reading it and approving it first.",
  "Give coaches, schools, or programs a dashboard, a roster view, or any account that watches your athlete.",
  "Decide who your athlete is allowed to contact. OneScore is a read on where they stand, not a gate.",
]

export default function ParentsPage() {
  return (
    <RouteShell>
      <PublicHeader accessSource="parents_header" />
      <main id="main-content" tabIndex={-1}>
        <section aria-labelledby="parents-heading" className={`${hero} oc-wash relative overflow-x-clip`}>
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
            <div>
              <p className={eyebrow}>For parents</p>
              <h1 id="parents-heading" className={`mt-5 ${h1}`}>
                Your athlete does the work. You can see exactly what that is.
              </h1>
              <p className={`mt-6 max-w-xl ${lede}`}>
                OneCommit is a recruiting workflow your track and field athlete runs themselves. This page is the
                plain version of what it does each day, what it deliberately does not do, and what it costs.
              </p>
              <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                <DownloadLink analyticsSource="parents_hero" className={`${pillPrimary} group w-full sm:w-auto`}>
                  Download the App
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
                  />
                </DownloadLink>
              </div>
              <p className="mt-5 text-[14px] leading-relaxed text-ink-soft">
                Athletes ages 13&ndash;17 need permission from a parent or guardian before creating an account.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[8%] bottom-[10%] top-[10%] -z-10 rounded-full bg-green-soft blur-3xl"
              />
              <div className="mx-auto w-[min(260px,70vw)] lg:w-[300px]">
                <DeviceFrame
                  src="/app/brief.png"
                  alt="OneCommit's daily Brief, dated, listing four things to do today with a time estimate on each"
                  priority
                  sizes="(max-width: 1024px) 260px, 300px"
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="the-day-heading" className={`${section} bg-canvas-subtle`}>
          <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <p className={eyebrow}>What a day looks like</p>
              <h2 id="the-day-heading" className={`mt-4 ${h2}`}>
                Fifteen minutes, not a second job.
              </h2>
              <p className={`mt-4 max-w-md ${lede}`}>
                The point is that the work is small enough to actually happen, and that it belongs to your athlete.
              </p>
            </Reveal>
            <RevealGroup stagger={0.06} className="border-t border-line">
              {theDay.map(({ title, body }) => (
                <RevealItem key={title} y={12} className="border-b border-line py-6">
                  <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section aria-labelledby="does-not-heading" className={section}>
          <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20`}>
            <Reveal>
              <p className={eyebrow}>What it does not do</p>
              <h2 id="does-not-heading" className={`mt-4 ${h2}`}>
                The boundaries, in plain words.
              </h2>
            </Reveal>
            <RevealGroup stagger={0.06} className="flex flex-col gap-4">
              {doesNot.map((item) => (
                <RevealItem key={item} y={12} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-soft text-clay">
                    <XCircle size={15} aria-hidden="true" />
                  </span>
                  <span className="text-[16px] leading-relaxed text-ink">{item}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section aria-labelledby="cost-heading" className={`${section} bg-canvas-subtle`}>
          <div className={`${container} mx-auto max-w-[46rem]`}>
            <Reveal>
              <p className={eyebrow}>What it costs</p>
              <h2 id="cost-heading" className={`mt-4 ${h2}`}>
                Free during the beta.
              </h2>
              <div className={`mt-6 space-y-5 ${prose}`}>
                <p>
                  There is no paid plan, no checkout, and no published price today. Access is invite-only and
                  depends on capacity. If a paid plan is introduced later, the terms and the price will be shown
                  before anything can be billed.
                </p>
                <p>
                  Outreach sends from your athlete&rsquo;s own connected mailbox, and Outlook/Microsoft 365 is
                  currently the only inbox option offered in the beta app. Gmail is not currently available.
                </p>
              </div>
              <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-8">
                {["No credit card to request access", "No auto-renewing subscription today", "No recruiting outcome is promised"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink">
                      <CheckCircle2 size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-green-mid" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <p className="mt-8 text-[15px] leading-relaxed text-ink-soft">
                Questions are welcome directly:{" "}
                <Link href="/support" className={inlineLink}>
                  contact support
                </Link>
                , or read the{" "}
                <Link href="/privacy" className={inlineLink}>
                  privacy policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className={inlineLink}>
                  terms
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <FooterSection />
    </RouteShell>
  )
}
