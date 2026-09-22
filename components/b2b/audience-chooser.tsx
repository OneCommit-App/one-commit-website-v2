"use client"

import { ArrowRight, School, ShieldCheck, UsersRound } from "lucide-react"
import { container, eyebrow, focusRing, h2, lede, section } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
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
    body: "Give track and field athletes a common recruiting workflow without adding an administrator portal.",
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

/*
 * Deliberately on the plain canvas: founder-story and pricing both sit on
 * bg-canvas-subtle, and three consecutive tinted sections read as one
 * undifferentiated stretch with no edge between them.
 */
export default function AudienceChooser() {
  return (
    <section aria-labelledby="audience-chooser-heading" className={section}>
      <div className={container}>
        <Reveal className="max-w-3xl">
          <p className={eyebrow}>For the adults supporting the athlete</p>
          <h2 id="audience-chooser-heading" className={`mt-4 ${h2}`}>
            One athlete-owned workflow. Three ways to support it.
          </h2>
          <p className={`mt-4 ${lede}`}>
            OneCommit stays athlete-owned: no coach or administrator dashboard, roster monitoring, team reporting, or
            automatic outreach.
          </p>
        </Reveal>
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {audienceCards.map(({ title, body, href, eventName, source, icon: Icon }) => (
            <RevealItem key={title} className="h-full">
              <article className="oc-raised flex h-full flex-col rounded-card bg-card p-7 shadow-soft ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-soft text-green">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{body}</p>
                <TrackedLink
                  href={href}
                  eventName={eventName}
                  eventSource={source}
                  className={`mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full text-[15px] font-semibold text-green transition-colors hover:text-green-mid ${focusRing}`}
                >
                  For {title.toLowerCase()}
                  <ArrowRight size={15} aria-hidden="true" />
                </TrackedLink>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
