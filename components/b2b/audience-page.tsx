import Image from "next/image"
import Link from "next/link"
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
import TrackedLink from "@/components/tracked-link"
import { audienceOrder, audiences, type AudienceKey } from "@/lib/b2b-audiences"

const icons = {
  profile: UserRoundCheck,
  target: Target,
  messages: MessagesSquare,
  checklist: ClipboardCheck,
  shield: ShieldCheck,
  people: UsersRound,
}

export default function AudiencePage({ audience: key }: { audience: AudienceKey }) {
  const audience = audiences[key]
  const isCoachPage = key === "coaches"

  return (
    <div className="min-h-screen bg-[#0f1a14] text-white">
      {isCoachPage ? <CoachCampaignAttribution /> : null}
      <AudienceNav current={key} />

      <main id="main-content">
        <section className="relative overflow-hidden px-4 pb-16 pt-64 min-[240px]:pt-52 sm:pb-20 sm:pt-48">
          <Image
            src="/app-explore.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="pointer-events-none object-contain object-right opacity-[0.13]"
          />
          <div className="absolute inset-0 bg-[#0f1a14]/55" />
          <div className="absolute inset-0 hero-dot-grid opacity-50" />
          <div className="relative mx-auto w-full max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#86efac]">
                {audience.eyebrow}
              </p>
              <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                {audience.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                {audience.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href={audience.mailtoHref}
                  eventName={isCoachPage ? "coach_interest_click" : "pilot_interest_click"}
                  eventSource={`${audience.eventSource}_hero`}
                  eventDestination={`${audience.eventSource}_pilot_email`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 py-2 text-center text-sm font-semibold text-[#0f1a14] outline-none transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a14]"
                >
                  <Mail size={16} aria-hidden="true" />
                  {audience.primaryCta}
                </TrackedLink>
                <TrackedLink
                  href="/demo"
                  eventName="demo_click"
                  eventSource={`${audience.eventSource}_hero`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white outline-none transition-colors hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a14]"
                >
                  See the athlete workflow
                  <ArrowRight size={15} aria-hidden="true" />
                </TrackedLink>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/65">
                {["Athlete-owned accounts", "D3-focused OneScore", "Capacity-dependent beta"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#86efac]" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="audience-benefits-heading" className="bg-[#f5f8f6] px-4 py-16 text-[#15231d] sm:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#235d48]">A practical support role</p>
            <h2 id="audience-benefits-heading" className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              {audience.benefitsHeading}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#15231d]/70 sm:text-base">
              {audience.benefitsDescription}
            </p>
            <div className="mt-10 grid border-t border-[#15231d]/15 md:grid-cols-3">
              {audience.benefits.map((benefit, index) => {
                const Icon = icons[benefit.icon]
                return (
                  <article
                    key={benefit.title}
                    className={`py-7 md:px-7 ${index > 0 ? "border-t border-[#15231d]/15 md:border-l md:border-t-0" : ""}`}
                  >
                    <Icon size={22} className="text-[#235d48]" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-bold">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#15231d]/70">{benefit.body}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section aria-labelledby="athlete-workspace-heading" className="bg-[#173027] px-4 py-16 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#86efac]">The current athlete workspace</p>
              <h2 id="athlete-workspace-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Real athlete screens, not a fabricated team dashboard.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                Athletes can compare matched schools, save a working list, prepare personal outreach through a supported connected inbox, and keep school communication history together.
              </p>
              <ul className="mt-7 grid gap-3 text-sm text-white/75">
                {[
                  "D3 match context organized by school",
                  "Personal outreach reviewed by the athlete",
                  "Sent and received activity kept with the school",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#86efac]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex min-h-[360px] items-end justify-center gap-3 overflow-hidden sm:min-h-[440px] sm:gap-6">
              <Image
                src="/app-explore.png"
                alt="OneCommit athlete screen showing a matched school list"
                width={460}
                height={850}
                className="h-auto w-[46%] max-w-[330px] rounded-lg shadow-2xl"
              />
              <Image
                src="/app-track-replies.png"
                alt="OneCommit athlete screen showing school communication history"
                width={460}
                height={850}
                className="h-auto w-[46%] max-w-[330px] rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        <PilotBoundaries available={audience.available} unavailable={audience.unavailable} />

        <section aria-labelledby="pilot-conversation-heading" className="bg-[#235d48] px-4 py-16 sm:py-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Pilot conversation</p>
              <h2 id="pilot-conversation-heading" className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Start with the athlete workflow and a candid fit conversation.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75">
                A conversation is not an invitation. Beta access depends on capacity and a supported app-access path.
              </p>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/70">
                Athletes ages 13-17 need permission from a parent or guardian before creating an account. {isCoachPage ? "A coach invitation" : "An adult pilot conversation"} does not replace that permission.
              </p>
            </div>
            <TrackedLink
              href={audience.mailtoHref}
              eventName={isCoachPage ? "coach_interest_click" : "pilot_interest_click"}
              eventSource={`${audience.eventSource}_final`}
              eventDestination={`${audience.eventSource}_pilot_email`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-2 text-center text-sm font-semibold text-[#0f1a14] outline-none transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#b9f6d0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#235d48]"
            >
              <Mail size={16} aria-hidden="true" />
              {audience.primaryCta}
            </TrackedLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08] px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold text-white">OneCommit LLC</div>
            <a
              href="mailto:admin@onecommit.us"
              className="mt-2 inline-flex min-h-11 items-center rounded-md text-[#86efac] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#86efac]"
            >
              admin@onecommit.us
            </a>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {audienceOrder.map((audienceKey) => (
              <Link key={audienceKey} href={audiences[audienceKey].path} className="inline-flex min-h-11 items-center hover:text-white">
                {audiences[audienceKey].shortLabel}
              </Link>
            ))}
            <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-white">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-white">Terms</Link>
            <Link href="/support" className="inline-flex min-h-11 items-center hover:text-white">Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
