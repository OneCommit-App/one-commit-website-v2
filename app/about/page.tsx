import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import FooterSection from "@/components/footer-section"
import PublicHeader from "@/components/public-header"
import TrackedLink from "@/components/tracked-link"
import { hasConfiguredDownloadUrl } from "@/lib/download"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why OneCommit is building an athlete-owned track and field recruiting workflow, the principles guiding the product, and what its beta status means today.",
  alternates: { canonical: "https://www.onecommit.us/about" },
  openGraph: {
    title: "About OneCommit",
    description:
      "OneCommit is building an athlete-owned track and field recruiting workflow with truthful evidence, deliberate outreach, and clear beta boundaries.",
    url: "https://www.onecommit.us/about",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About OneCommit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About OneCommit",
    description:
      "An athlete-owned track and field recruiting workflow with truthful evidence, deliberate outreach, and clear beta boundaries.",
    images: ["/opengraph-image"],
  },
}

const principles = [
  {
    title: "Athlete control",
    body: "The athlete owns the profile, the school list, and every outreach decision. Nothing sends without the athlete's approval.",
  },
  {
    title: "Evidence before certainty",
    body: "OneScore and school context are decision support, not promises. Missing or limited evidence should stay visible instead of becoming false precision.",
  },
  {
    title: "Clear product boundaries",
    body: "Beta availability, supported inbox providers, and unfinished capabilities should be stated plainly so families can make informed choices.",
  },
]

const distributionFact = hasConfiguredDownloadUrl
  ? "Use the Get the app action for the currently configured download path. Platform availability can vary."
  : "Public app download links are not configured yet. Request access or email support to ask about current beta availability."

const betaFacts = [
  "Beta access is capacity-dependent and requires a supported app-access path.",
  "Matching is D3-focused. OneCommit does not promise admission, a roster spot, a coach reply, or any recruiting outcome.",
  "Outlook/Microsoft 365 is currently the only inbox option offered in the beta app. Gmail is not currently available.",
  distributionFact,
]

const actionLinkClass =
  "-mx-3 inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#86efac] transition-colors hover:bg-white/[0.04] hover:text-[#bbf7d0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f1a14] text-white">
      <PublicHeader accessSource="about_header" />
      <main id="main-content" tabIndex={-1}>
        <section
          aria-labelledby="about-heading"
          className="flex justify-center border-b border-white/[0.07] px-4 pb-14 pt-14 sm:pb-16 sm:pt-16"
        >
          <div className="w-full max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">
              About OneCommit
            </p>
            <h1
              id="about-heading"
              className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl"
            >
              OneCommit
            </h1>
            <p className="mt-5 max-w-3xl text-xl font-medium leading-relaxed text-white sm:text-2xl">
              A recruiting workflow built around the athlete.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              We are building OneCommit for high school track and field athletes who need a clearer way to
              organize their profile, evaluate D3-focused school matches, and manage recruiting outreach from
              their own account.
            </p>
          </div>
        </section>

        <section aria-labelledby="purpose-heading" className="flex justify-center px-4 py-14 sm:py-16">
          <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">Why it exists</p>
              <h2 id="purpose-heading" className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Recruiting creates enough uncertainty already.
              </h2>
            </div>
            <div className="space-y-4 text-base leading-7 text-white/70">
              <p>
                Athletes often have their marks, academics, school research, and coach conversations spread
                across disconnected tools. OneCommit is intended to make that work easier to inspect and act on
                without taking control away from the athlete.
              </p>
              <p>
                The product is decision support. It can help organize evidence and next steps, but it cannot know
                a coach&apos;s final evaluation or guarantee an outcome.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="principles-heading"
          className="flex justify-center border-y border-white/[0.07] bg-[#13231a] px-4 py-14 sm:py-16"
        >
          <div className="w-full max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">How we build</p>
            <h2 id="principles-heading" className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              The principles we use
            </h2>
            <div className="mt-9 grid gap-8 md:grid-cols-3 md:gap-10">
              {principles.map((principle, index) => (
                <article key={principle.title} className="border-t border-white/[0.12] pt-5">
                  <p className="text-xs font-semibold text-[#f3d28d]">0{index + 1}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="beta-heading" className="flex justify-center px-4 py-14 sm:py-16">
          <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">Current status</p>
              <h2 id="beta-heading" className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                What beta means today
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/65">
                These boundaries are part of the product, not fine print.
              </p>
            </div>
            <ul className="divide-y divide-white/[0.09] border-y border-white/[0.09]">
              {betaFacts.map((fact) => (
                <li key={fact} className="py-4 text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-labelledby="accountability-heading"
          className="flex justify-center border-t border-white/[0.07] px-4 py-14 sm:py-16"
        >
          <div className="w-full max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">Accountability</p>
            <h2 id="accountability-heading" className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ask us directly.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              Questions about access, product boundaries, privacy, or account data should have a clear path to a
              real answer. Email the team or review the policies that govern the service.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              <TrackedLink
                href="mailto:admin@onecommit.us"
                eventName="support_click"
                eventSource="about_contact"
                className={actionLinkClass}
              >
                admin@onecommit.us
                <ArrowUpRight aria-hidden="true" size={14} />
              </TrackedLink>
              <Link href="/support" className={actionLinkClass}>Support</Link>
              <Link href="/privacy" className={actionLinkClass}>Privacy</Link>
              <Link href="/terms" className={actionLinkClass}>Terms</Link>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
