import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react"
import DownloadLink from "@/components/download-link"
import TrackedLink from "@/components/tracked-link"

export const metadata: Metadata = {
  title: "For High School Coaches",
  description:
    "Give track and field athletes a practical recruiting plan with D3-focused OneScore matches, athlete-owned outreach, and a simple weekly team rhythm.",
  alternates: { canonical: "https://www.onecommit.us/coaches" },
  openGraph: {
    title: "OneCommit for High School Track Coaches",
    description:
      "A recruiting plan athletes can own, with D3-focused OneScore matches, organized outreach, and a simple weekly coach check-in.",
    url: "https://www.onecommit.us/coaches",
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OneCommit for high school track and field coaches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneCommit for High School Track Coaches",
    description:
      "Give every athlete a recruiting plan without becoming their recruiting agent.",
    images: ["/opengraph-image"],
  },
}

const coachPilotHref =
  "mailto:admin@onecommit.us?subject=OneCommit%20team%20beta&body=School%3A%0ATeam%20size%3A%0ABest%20time%20to%20talk%3A"

const weeklySteps = [
  {
    icon: Users,
    title: "Athletes build their profile",
    body: "Each athlete uses Riley voice onboarding or typed setup to add events, marks, academics, and college preferences.",
  },
  {
    icon: ClipboardCheck,
    title: "They compare D3 OneScore fits",
    body: "OneCommit organizes the current D3 beta dataset so the weekly conversation starts with school-by-school context, not a blank spreadsheet.",
  },
  {
    icon: MessageSquareText,
    title: "Your check-in stays focused",
    body: "Review what changed, who replied, and the next task. Athletes still own every message and decision.",
  },
]

export default function CoachesPage() {
  return (
    <main className="min-h-screen bg-[#0f1a14] text-white">
      <header className="absolute inset-x-0 top-0 z-20 px-4 pt-5">
        <nav className="mx-auto flex h-11 w-full max-w-6xl items-center justify-between border-b border-white/[0.10]">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
            <Image src="/logo.png" alt="OneCommit logo" width={26} height={26} className="h-6 w-6 rounded-full" />
            OneCommit
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-8 items-center gap-1.5 px-2 text-xs font-medium text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Athlete site</span>
            </Link>
            <DownloadLink
              analyticsSource="coaches_header"
              fallbackLabel="Get Access"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-semibold text-[#0f1a14] transition-colors hover:bg-white/90"
            >
              Download App
              <ArrowRight size={13} />
            </DownloadLink>
          </div>
        </nav>
      </header>

      <section className="relative flex min-h-[78svh] items-center overflow-hidden px-4 pb-16 pt-28">
        <Image
          src="/app-explore.png"
          alt="OneCommit school matching screen"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="pointer-events-none object-contain object-right opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-[#0f1a14]/45" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-[#86efac]">
              <Users size={15} />
              For high school track and field coaches
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              A free recruiting workspace for your track athletes.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              OneCommit gives athletes a structured place to build school lists, prepare coach outreach, and track replies. You guide the weekly conversation without running every inbox.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href={coachPilotHref}
                eventName="coach_interest_click"
                eventSource="coaches_hero"
                eventDestination="team_beta_email"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0f1a14] transition-colors hover:bg-white/90"
              >
                <Mail size={15} />
                Bring OneCommit to my team
              </TrackedLink>
              <TrackedLink
                href="/demo"
                eventName="demo_click"
                eventSource="coaches_hero"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]"
              >
                Watch the athlete demo
                <ArrowRight size={15} />
              </TrackedLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/55">
              {["Free beta access", "D3-focused OneScore", "Athlete-owned accounts"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#86efac]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f6] px-4 pb-16 pt-8 text-[#15231d] sm:pt-12">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-semibold uppercase text-[#235d48]">A practical weekly rhythm</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold sm:text-4xl">
            Coach the decision process. Let athletes own the work.
          </h2>
          <div className="mt-10 grid border-t border-[#15231d]/15 md:grid-cols-3">
            {weeklySteps.map((step, index) => (
              <div
                key={step.title}
                className={`py-7 md:px-7 ${index > 0 ? "border-t border-[#15231d]/15 md:border-l md:border-t-0" : ""}`}
              >
                <step.icon size={22} className="text-[#235d48]" />
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#15231d]/65">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173027] px-4 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase text-[#86efac]">The athlete workspace</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              More useful than another profile link.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              Athletes can compare schools, save a working list, send from Gmail or Outlook, and keep communication history together. That gives your check-ins something concrete to review.
            </p>
            <ul className="mt-7 grid gap-3 text-sm text-white/70">
              {["Matched schools organized in one place", "Personal outreach reviewed by the athlete", "Sent and received messages visible by school"].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#86efac]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-h-[440px] items-end justify-center gap-3 overflow-hidden sm:gap-6">
            <Image
              src="/app-explore.png"
              alt="Matched school list in OneCommit"
              width={460}
              height={850}
              className="h-auto w-[46%] max-w-[330px] rounded-lg shadow-2xl"
            />
            <Image
              src="/app-track-replies.png"
              alt="School communication history in OneCommit"
              width={460}
              height={850}
              className="h-auto w-[46%] max-w-[330px] rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 text-[#15231d]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">What coaches can use today</h2>
            <ul className="mt-6 grid gap-4 text-sm text-[#15231d]/70">
              {["A free athlete beta rollout", "D3-focused OneScore matching", "A consistent profile and school-list checklist", "A weekly review of outreach and replies"].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#235d48]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[#15231d]/15 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <h2 className="text-2xl font-bold">What we will not pretend exists</h2>
            <ul className="mt-6 grid gap-4 text-sm text-[#15231d]/70">
              {["No coach dashboard or roster surveillance", "No guaranteed coach replies or offers", "No automatic outreach without athlete review and approval", "No claim that broader division coverage is live yet"].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#235d48]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#235d48] px-4 py-16">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase text-white/65">Free team beta</p>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold">
              Start with a small athlete group and one weekly check-in.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              Tell us your school and team size. We will send access instructions and a simple kickoff outline.
            </p>
          </div>
          <TrackedLink
            href={coachPilotHref}
            eventName="coach_interest_click"
            eventSource="coaches_final"
            eventDestination="team_beta_email"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0f1a14] transition-colors hover:bg-white/90"
          >
            <Mail size={15} />
            Start a team beta
          </TrackedLink>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] px-4 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>OneCommit LLC</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link href="/support" className="transition-colors hover:text-white">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
