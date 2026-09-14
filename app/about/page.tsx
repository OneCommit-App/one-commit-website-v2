import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import DeviceFrame from "@/components/device-frame"
import FooterSection from "@/components/footer-section"
import { container, eyebrow, eyebrowDark, h2, h2Dark, lede, section } from "@/components/home/tokens"
import PublicHeader from "@/components/public-header"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import RouteShell from "@/components/routes/route-shell"
import { h1, hero, prose, textLink } from "@/components/routes/tokens"
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

export default function AboutPage() {
  return (
    <RouteShell>
      <PublicHeader accessSource="about_header" />
      <main id="main-content" tabIndex={-1}>
        {/* Hero: purpose on the left, the athlete's own profile screen on the right. */}
        <section aria-labelledby="about-heading" className={`${hero} overflow-x-clip`}>
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
            <div>
              <p className={eyebrow}>About OneCommit</p>
              <h1 id="about-heading" className={`mt-5 ${h1}`}>
                A recruiting workflow built around the athlete.
              </h1>
              <p className={`mt-6 max-w-xl ${lede}`}>
                We are building OneCommit for high school track and field athletes who need a clearer way to organize
                their profile, evaluate D3-focused school matches, and manage recruiting outreach from their own
                account.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[8%] top-[10%] bottom-[10%] -z-10 rounded-full bg-green-soft blur-3xl"
              />
              <div className="mx-auto w-[min(260px,70vw)] lg:w-[300px]">
                <DeviceFrame
                  src="/app/profile.png"
                  alt="OneCommit profile screen with a 200m mark, GPA and target prompts, a Riley's Take card, and the OneScore readiness meter"
                  priority
                  sizes="(max-width: 1024px) 260px, 300px"
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="purpose-heading" className={section}>
          <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
            <Reveal>
              <p className={eyebrow}>Why it exists</p>
              <h2 id="purpose-heading" className={`mt-4 ${h2}`}>
                Recruiting creates enough uncertainty already.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className={`space-y-5 ${prose}`}>
              <p>
                Athletes often have their marks, academics, school research, and coach conversations spread across
                disconnected tools. OneCommit is intended to make that work easier to inspect and act on without
                taking control away from the athlete.
              </p>
              <p>
                The product is decision support. It can help organize evidence and next steps, but it cannot know a
                coach&apos;s final evaluation or guarantee an outcome.
              </p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="principles-heading" className="bg-shell px-4 py-24 text-white sm:px-6 lg:py-32">
          <div className={container}>
            <Reveal className="max-w-2xl">
              <p className={eyebrowDark}>How we build</p>
              <h2 id="principles-heading" className={`mt-4 ${h2Dark}`}>
                The principles we use
              </h2>
            </Reveal>
            <RevealGroup className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {principles.map((principle, index) => (
                <RevealItem key={principle.title} className="border-t border-white/15 pt-6">
                  <p className="text-[13px] font-semibold tracking-[0.08em] text-mint">0{index + 1}</p>
                  <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.02em] text-white">{principle.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-white/70">{principle.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section aria-labelledby="beta-heading" className={`${section} bg-canvas-subtle`}>
          <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <p className={eyebrow}>Current status</p>
              <h2 id="beta-heading" className={`mt-4 ${h2}`}>
                What beta means today
              </h2>
              <p className={`mt-4 max-w-md ${lede}`}>These boundaries are part of the product, not fine print.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="divide-y divide-line border-y border-line">
                {betaFacts.map((fact) => (
                  <li key={fact} className="py-5 text-[17px] leading-[1.6] text-ink sm:text-[18px]">
                    {fact}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="accountability-heading" className={section}>
          <Reveal className="mx-auto w-full max-w-3xl">
            <p className={eyebrow}>Accountability</p>
            <h2 id="accountability-heading" className={`mt-4 ${h2}`}>
              Ask us directly.
            </h2>
            <p className={`mt-4 ${lede}`}>
              Questions about access, product boundaries, privacy, or account data should have a clear path to a real
              answer. Email the team or review the policies that govern the service.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-1">
              <TrackedLink
                href="mailto:admin@onecommit.us"
                eventName="support_click"
                eventSource="about_contact"
                className={textLink}
              >
                admin@onecommit.us
                <ArrowUpRight aria-hidden="true" size={15} />
              </TrackedLink>
              <Link href="/support" className={textLink}>
                Support
              </Link>
              <Link href="/privacy" className={textLink}>
                Privacy
              </Link>
              <Link href="/terms" className={textLink}>
                Terms
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <FooterSection />
    </RouteShell>
  )
}
