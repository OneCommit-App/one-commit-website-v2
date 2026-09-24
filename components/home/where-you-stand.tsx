"use client"

import { container, eyebrow, h2, lede, section } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

/**
 * The band names are the ones the app uses (visible in public/app/explore.png).
 * They are named here without thresholds or counts on purpose — the boundaries live
 * in the product and describing them here would be inventing a definition the site
 * cannot back.
 */
const bands = ["Reach", "Target", "Foundation"]

export default function WhereYouStand() {
  return (
    <section aria-labelledby="where-you-stand-heading" className={`oc-band-soft ${section} bg-canvas-subtle`}>
      {/* Nested, not `${container} max-w-[52rem]` — two max-width utilities in one class
          string collide and the token's max-w-6xl wins on emission order. Outer box is the
          rail, inner box is the measure. */}
      <div className={container}>
        <div className="mx-auto w-full max-w-[52rem] text-center">
        <Reveal>
          <p className={eyebrow}>Where you stand</p>
          <h2 id="where-you-stand-heading" className={`mt-4 ${h2}`}>
            An honest read, not a locked door.
          </h2>
          <p className={`mx-auto mt-5 max-w-2xl ${lede}`}>
            OneScore sorts every school on your list from your marks, grades, and preferences. That is a read on
            where you stand today — not a rule about who you are allowed to write to. You choose who to contact.
          </p>
          <p className={`mx-auto mt-4 max-w-2xl ${lede}`}>
            And it shows its work. Open any school and the score breaks down input by input — each mark, your
            GPA, your SAT — against that program&rsquo;s range, so you can see what is carrying the number and
            what is holding it back.
          </p>
        </Reveal>

        <RevealGroup stagger={0.07} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {bands.map((band) => (
            <RevealItem key={band} y={12}>
              <span className="inline-flex items-center rounded-full bg-card px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-green ring-1 ring-line">
                {band}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-8 max-w-2xl text-[14px] leading-relaxed text-ink-faint">
            And the right move changes with the year you are in. Early on, the app says so plainly: no outreach
            pressure at this stage &mdash; log real races, keep the grades up, and let your trajectory tell the
            story.
          </p>
        </Reveal>
        </div>
      </div>
    </section>
  )
}
