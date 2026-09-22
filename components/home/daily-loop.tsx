"use client"

import { BellRing, CheckCircle2, Gauge, ListChecks } from "lucide-react"
import DeviceFrame from "@/components/device-frame"
import { container, eyebrow, h2, lede, section } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

/**
 * Every claim here is readable in a shipped screen. This band renders brief.png,
 * which carries rows 1 and 2; rows 3 and 4 are visible in home.png, which the page
 * shows in the hero rather than here — the comment used to say this band renders
 * both, and it does not. Nothing describes behaviour the screens do not show, and no
 * counts or outcomes are invented: the copy names what the counters ARE, never what
 * they read.
 */
const loop = [
  {
    icon: ListChecks,
    title: "A dated list, not a dashboard",
    body: "The Brief opens on today's date with a short list of things to do, each one carrying its own time estimate.",
  },
  {
    icon: CheckCircle2,
    title: "Today's actions keep their own count",
    body: "The day's tasks sit under a completion counter, so finishing the list is a thing you can actually do.",
  },
  {
    icon: Gauge,
    title: "The Queue holds the running total",
    body: "Matches saved, messages sent, replies received — the three numbers that say where the whole process stands.",
  },
  {
    icon: BellRing,
    title: "Alerts when a coach responds",
    body: "Notifications fire on a reply landing, not on a schedule, so checking the app is never the point.",
  },
]

/* Phone on the left, copy on the right — the inverse of every other band on the
   page, so the sequence does not read as one template repeated. */
export default function DailyLoop() {
  return (
    <section aria-labelledby="daily-loop-heading" className={`${section} bg-canvas-subtle`}>
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20`}>
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
            <div className="mx-auto w-[min(280px,74vw)] lg:w-[320px]">
              <DeviceFrame
                src="/app/brief.png"
                alt="OneCommit's daily Brief, dated, listing four things to do today with a time estimate on each"
                sizes="(max-width: 1024px) 280px, 320px"
              />
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className={eyebrow}>The daily loop</p>
            <h2 id="daily-loop-heading" className={`mt-4 ${h2}`}>
              It tells you what to do today.
            </h2>
            <p className={`mt-4 max-w-xl ${lede}`}>
              Recruiting stalls because nobody knows the next move. OneCommit turns it into a short list you can
              finish before practice.
            </p>
          </Reveal>

          <RevealGroup stagger={0.06} className="mt-10 border-t border-line">
            {loop.map(({ icon: Icon, title, body }) => (
              <RevealItem key={title} y={12} className="flex gap-4 border-b border-line py-5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-green ring-1 ring-line">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
