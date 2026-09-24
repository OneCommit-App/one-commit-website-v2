"use client"

import Image from "next/image"
import { container, eyebrow, h2, lede, section } from "@/components/home/tokens"
import { Reveal } from "@/components/reveal"

/**
 * The band names are the app's own (visible in public/app/explore.png). They are set
 * without thresholds on purpose — the boundaries live in the product, and describing
 * them here would invent a definition the site cannot back.
 *
 * The card is a crop of that same capture rather than a phone-framed thumbnail: at
 * 260px inside a device frame not one of its numbers is legible, and those numbers
 * are the entire argument. The crop deliberately includes the grey "Preferences 50%"
 * row — four green bars and one grey one is what makes "what is holding it back"
 * true rather than a boast.
 */
export default function WhereYouStand() {
  return (
    <section aria-labelledby="where-you-stand-heading" className={`oc-band-soft ${section} bg-canvas-subtle`}>
      <div className={container}>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <Reveal>
            <p className={eyebrow}>Where you stand</p>
            <h2 id="where-you-stand-heading" className={`mt-4 ${h2}`}>
              An honest read, not a locked door.
            </h2>
            <p className={`mt-5 max-w-xl ${lede}`}>
              Every school on your list gets a band — Reach, Target, or Foundation — and the score shows its
              work. Each mark, your GPA, your SAT, measured against that program&rsquo;s own range.
            </p>
            {/* The band's whole argument cashes out in this paragraph, and it used to be
                the middle of three identical grey blocks. Same size and leading as `lede`
                — only the ink token changes — so nothing rewraps and it inverts correctly
                in both schemes. Deliberately inline rather than a tokens.ts export: a
                second full-ink lede anywhere else would cancel the step. */}
            <p className="mt-4 max-w-xl text-pretty text-[17px] leading-[1.55] text-ink sm:text-[19px]">
              Then you decide. You can write to any school on the list, including the ones it called a Reach.
              The read is there to inform the letter, not to decide whether you are allowed to send it.
            </p>
            {/* "Not a locked door" is abstract until the reader knows a door exists.
                Describes the GATING BEHAVIOUR only — verified 2026-09-23 on the vendor's
                own product page, which states a Contact Coach button appears on programs
                where verified performances meet the program's standards. Deliberately
                does NOT assert why they do it: the research inferred a motive from their
                business model, and they also sell paid tiers to athletes, so the motive
                is contested and the behaviour is not. No vendor is named until Hugh says
                so; naming one dates the claim the day they change the gate. */}
            <p className="oc-lane-top mt-6 max-w-xl border-t border-line pt-6 text-[16px] leading-relaxed text-ink-soft">
              Elsewhere in this sport a contact button can be gated — it appears only once your verified marks
              already clear a program&rsquo;s published standard. OneCommit gives you the same honest read and
              leaves the button where it is.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <figure className="mx-auto w-full max-w-[560px]">
              {/* The capture is light-appearance, so on the dark canvas it keeps a
                  hairline and .oc-capture seats it (app/globals.css). The hairline is
                  MORE load-bearing after the dim, not less: this capture is not a
                  uniform white slab — its deep-green card header goes dark against the
                  band without it. The dead `dark:` variants that used to sit here never
                  fired; no ThemeProvider is mounted, so .dark is never set and the dark
                  scheme arrives only through the media query. */}
              <div className="oc-raised overflow-hidden rounded-card bg-card shadow-lift ring-1 ring-line [@media(prefers-color-scheme:dark)]:ring-white/10">
                <Image
                  src="/app/onescore-card.png"
                  alt="A school card in the OneCommit app: Anderson University, OneScore 85 out of 100, banded Target, above the line 'Your 200m is right in their range', then a breakdown headed 'Why it scores 85' listing a 22.31 200m, a 50.44 400m, a 3.70 GPA and a 1280 SAT each marked above the program's range, with preferences at 50 percent"
                  width={1150}
                  height={1248}
                  sizes="(max-width: 1024px) 92vw, 560px"
                  className="oc-capture h-auto w-full"
                />
              </div>
              <figcaption className="mt-4 text-center text-[13px] leading-relaxed text-ink-soft">
                A school card from the app. Anderson University is one program in the current D3 beta dataset,
                not a OneCommit partner.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
