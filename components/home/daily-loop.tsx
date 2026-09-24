"use client"

import Image from "next/image"
import { BellRing, CheckCircle2, Gauge, ListChecks } from "lucide-react"
import { container, eyebrow, h3Section, lede, section } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

/**
 * Every claim here is readable in a shipped screen. This band renders a crop of
 * brief.png, which carries rows 1 and 2; rows 3 and 4 are visible in home.png, which
 * the page shows in the hero rather than here. Nothing describes behaviour the
 * screens do not show, and no counts or outcomes are invented: the copy names what
 * the counters ARE, never what they read.
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

/* Screen on the left, copy on the right — the inverse of every other band on the
   page, so the sequence does not read as one template repeated. The image is a crop
   of brief.png rather than the phone it used to be: at 320px inside a device frame
   the one sentence worth reading here — "4 things to do today." — was 11px tall.
   The columns had to even up when the art turned landscape; the inversion is the
   order, not the ratio. */
export default function DailyLoop() {
  return (
    <section aria-labelledby="daily-loop-heading" className={`oc-band-soft ${section} bg-canvas-subtle`}>
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16`}>
        <Reveal className="order-2 lg:order-1">
          <figure className="mx-auto w-full max-w-[600px] lg:mx-0">
            {/* Light-appearance capture. Same treatment as the OneScore card: a
                hairline so it is not a white slab after dark, and a fixed width and
                height either way, so CLS stays 0. */}
            <div className="oc-raised overflow-hidden rounded-card bg-card shadow-lift ring-1 ring-line [@media(prefers-color-scheme:dark)]:brightness-[0.96] [@media(prefers-color-scheme:dark)]:ring-white/10">
              <Image
                src="/app/brief-today.png"
                alt="The Brief in the OneCommit app, dated Wednesday September 9, headed '4 things to do today.', with the first task card marked 8 MIN, 'Review 71 top matches', and an Open button"
                width={1206}
                height={928}
                sizes="(max-width: 1024px) 92vw, 600px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 text-[13px] leading-relaxed text-ink-soft">
              A Brief from the beta. The date, the count and the time estimates are whatever your own list
              holds that morning.
            </figcaption>
          </figure>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className={eyebrow}>The daily loop</p>
            <h2 id="daily-loop-heading" className={`mt-4 ${h3Section}`}>
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
