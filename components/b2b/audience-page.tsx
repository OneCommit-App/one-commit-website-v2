import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  MessagesSquare,
  ShieldCheck,
  Target,
  UserRoundCheck,
  UsersRound,
} from "lucide-react"
import AudienceNav from "@/components/b2b/audience-nav"
import PilotBoundaries from "@/components/b2b/pilot-boundaries"
import CoachCampaignAttribution from "@/components/coach-campaign-attribution"
import DeviceFrame from "@/components/device-frame"
import FooterSection from "@/components/footer-section"
import {
  container,
  eyebrow,
  eyebrowDark,
  h2,
  h2Dark,
  lede,
  pillPrimary,
  pillPrimaryDark,
  pillSecondary,
  section,
} from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import RouteShell from "@/components/routes/route-shell"
import { h1, h3, iconDot, ledeDark } from "@/components/routes/tokens"
import TrackedLink from "@/components/tracked-link"
import { audiences, type AudienceKey } from "@/lib/b2b-audiences"

const icons = {
  profile: UserRoundCheck,
  target: Target,
  messages: MessagesSquare,
  checklist: ClipboardCheck,
  shield: ShieldCheck,
  people: UsersRound,
}

const heroProofPoints = ["Athlete-owned accounts", "D3-focused OneScore", "Capacity-dependent beta"]

const workspacePoints = [
  "D3 match context organized by school",
  "Personal outreach reviewed by the athlete",
  "Sent and received activity kept with the school",
]

export default function AudiencePage({ audience: key }: { audience: AudienceKey }) {
  const audience = audiences[key]
  const isCoachPage = key === "coaches"
  const interestEvent = isCoachPage ? "coach_interest_click" : "pilot_interest_click"

  return (
    <RouteShell>
      {isCoachPage ? <CoachCampaignAttribution /> : null}
      <AudienceNav current={key} />

      <main id="main-content" tabIndex={-1}>
        {/*
          The audience switches sit under the fixed nav, so the hero pads past them:
          three wrapped rows below 240px, two rows on narrow phones, one row from sm up.
        */}
        <section className="oc-wash relative overflow-x-clip px-4 pb-16 pt-64 min-[240px]:pt-52 sm:px-6 sm:pb-24 sm:pt-40 lg:pt-44">
          <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
            <div>
              <p className={eyebrow}>{audience.eyebrow}</p>
              <h1 className={`mt-5 ${h1}`}>{audience.headline}</h1>
              <p className={`mt-6 max-w-xl ${lede}`}>{audience.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href={audience.mailtoHref}
                  eventName={interestEvent}
                  eventSource={`${audience.eventSource}_hero`}
                  eventDestination={`${audience.eventSource}_pilot_email`}
                  className={`${pillPrimary} w-full sm:w-auto`}
                >
                  <Mail size={16} aria-hidden="true" />
                  {audience.primaryCta}
                </TrackedLink>
                <TrackedLink
                  href="/demo"
                  eventName="demo_click"
                  eventSource={`${audience.eventSource}_hero`}
                  className={`${pillSecondary} w-full sm:w-auto`}
                >
                  See the athlete workflow
                  <ArrowRight size={15} aria-hidden="true" />
                </TrackedLink>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[14px] font-medium text-ink-soft">
                {heroProofPoints.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-green-mid" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[8%] top-[10%] bottom-[10%] -z-10 rounded-full bg-green-soft blur-3xl"
              />
              <div className="mx-auto w-[min(280px,74vw)] lg:w-[340px]">
                <DeviceFrame
                  src="/app/explore.png"
                  alt="OneCommit Explore screen scoring a D3 program against the athlete's 200m and 400m marks, GPA, and SAT, with a Save to pipeline action"
                  priority
                  sizes="(max-width: 1024px) 280px, 340px"
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="audience-benefits-heading" className={`${section} bg-canvas-subtle`}>
          <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <p className={eyebrow}>A practical support role</p>
              <h2 id="audience-benefits-heading" className={`mt-4 ${h2}`}>
                {audience.benefitsHeading}
              </h2>
              <p className={`mt-4 max-w-md ${lede}`}>{audience.benefitsDescription}</p>
            </Reveal>

            <RevealGroup className="border-t border-line">
              {audience.benefits.map((benefit) => {
                const Icon = icons[benefit.icon]
                return (
                  <RevealItem key={benefit.title} className="flex gap-5 border-b border-line py-7">
                    <span className={iconDot}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className={h3}>{benefit.title}</h3>
                      <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{benefit.body}</p>
                    </div>
                  </RevealItem>
                )
              })}
            </RevealGroup>
          </div>
        </section>

        {/*
          Deep-green band. The two figures are earlier-build captures that already carry
          their own black frame; blending them with `lighten` drops that black into the
          band so only the screens show, and the caption dates them honestly.
        */}
        <section
          aria-labelledby="athlete-workspace-heading"
          className="oc-band isolate overflow-hidden bg-shell px-4 py-24 text-white sm:px-6 lg:py-32"
        >
          <div className={`${container} grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16`}>
            <Reveal>
              <p className={eyebrowDark}>The current athlete workspace</p>
              <h2 id="athlete-workspace-heading" className={`mt-4 ${h2Dark}`}>
                Real athlete screens, not a fabricated team dashboard.
              </h2>
              <p className={`mt-4 ${ledeDark}`}>
                Athletes can compare matched schools, save a working list, prepare personal outreach through a
                supported connected inbox, and keep school communication history together.
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {workspacePoints.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-white/80">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <figure className="mx-auto w-full max-w-[640px]">
              <div className="flex items-end justify-center gap-5 sm:gap-7">
                <div className="w-[46%] max-w-[286px]">
                  <DeviceFrame
                    src="/app/pipeline.png"
                    alt="OneCommit Pipeline: six saved D3 schools, each with its OneScore and an Email action, above a prompt to connect an inbox so messages send from the athlete's own address"
                    sizes="(max-width: 640px) 44vw, 286px"
                  />
                </div>
                <div className="w-[46%] max-w-[286px]">
                  <DeviceFrame
                    src="/app/riley.png"
                    alt="OneCommit home: the day's focused actions above The Queue, which counts matches, sent messages, and replies"
                    sizes="(max-width: 640px) 44vw, 286px"
                  />
                </div>
              </div>
              <figcaption className="mt-6 text-center text-[13px] leading-relaxed text-white/70">
                The current beta build: the saved school list with its outreach actions, and the home queue that counts
                matches, sent messages, and replies.
              </figcaption>
            </figure>
          </div>
        </section>

        <PilotBoundaries available={audience.available} unavailable={audience.unavailable} />

        <section aria-labelledby="pilot-conversation-heading" className="oc-band bg-shell px-4 py-24 text-white sm:px-6 lg:py-32">
          <div className={`${container} grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]`}>
            <Reveal>
              <p className={eyebrowDark}>Pilot conversation</p>
              <h2 id="pilot-conversation-heading" className={`mt-4 ${h2Dark}`}>
                Start with the athlete workflow and a candid fit conversation.
              </h2>
              <p className={`mt-5 max-w-xl ${ledeDark}`}>
                A conversation is not an invitation. Beta access depends on capacity and a supported app-access path.
              </p>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/70">
                Athletes ages 13-17 need permission from a parent or guardian before creating an account.{" "}
                {isCoachPage ? "A coach invitation" : "An adult pilot conversation"} does not replace that permission.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="flex lg:justify-end">
              <TrackedLink
                href={audience.mailtoHref}
                eventName={interestEvent}
                eventSource={`${audience.eventSource}_final`}
                eventDestination={`${audience.eventSource}_pilot_email`}
                className={`${pillPrimaryDark} w-full sm:w-auto`}
              >
                <Mail size={16} aria-hidden="true" />
                {audience.primaryCta}
              </TrackedLink>
            </Reveal>
          </div>
        </section>
      </main>

      <FooterSection />
    </RouteShell>
  )
}
