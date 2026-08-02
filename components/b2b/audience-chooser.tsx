"use client"

import { ArrowRight, School, ShieldCheck, UsersRound } from "lucide-react"
import TrackedLink from "@/components/tracked-link"

const audienceCards = [
  {
    title: "Coaches",
    body: "Guide a clearer recruiting check-in while each athlete owns the account, outreach, and decisions.",
    href: "/coaches",
    eventName: "coach_page_click" as const,
    source: "home_audience_coaches",
    icon: UsersRound,
  },
  {
    title: "Schools",
    body: "Give track and field athletes a common D3-focused workflow without adding an administrator portal.",
    href: "/schools",
    eventName: "audience_page_click" as const,
    source: "home_audience_schools",
    icon: School,
  },
  {
    title: "Athletic programs",
    body: "Reinforce a repeatable athlete-led rhythm for profiles, school comparison, outreach, and replies.",
    href: "/athletic-programs",
    eventName: "audience_page_click" as const,
    source: "home_audience_programs",
    icon: ShieldCheck,
  },
]

export default function AudienceChooser() {
  return (
    <section aria-labelledby="audience-chooser-heading" className="border-y border-white/[0.07] bg-[#17251e] px-4 py-14 sm:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#86efac]">For the adults supporting the athlete</p>
        <h2 id="audience-chooser-heading" className="mt-3 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
          One athlete-owned workflow. Three ways to support it.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">
          OneCommit stays athlete-owned: no coach or administrator dashboard, roster monitoring, team reporting, or automatic outreach.
        </p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {audienceCards.map(({ title, body, href, eventName, source, icon: Icon }) => (
            <article key={title} className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.04] p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#86efac]/10 text-[#86efac]">
                <Icon size={19} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{body}</p>
              <TrackedLink
                href={href}
                eventName={eventName}
                eventSource={source}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-[#b9f6d0] outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17251e]"
              >
                For {title.toLowerCase()}
                <ArrowRight size={15} aria-hidden="true" />
              </TrackedLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
