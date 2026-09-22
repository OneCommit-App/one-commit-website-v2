"use client"

import { eyebrow, section } from "@/components/home/tokens"
import { Reveal } from "@/components/reveal"

/*
 * Plain canvas on purpose: DailyLoop above is bg-canvas-subtle, and two tinted
 * sections abutting leaves no edge between them — the seam WorkspaceSection used to
 * provide. The run is now HowItWorks canvas / DailyLoop subtle / FounderStory canvas.
 */
export default function FounderStory() {
  return (
    <section aria-labelledby="story-heading" className={section}>
      {/* Deliberately not the shared container token plus max-w-3xl: both are
          max-width utilities in the same layer, so the token's max-w-6xl won on
          emission order whatever the class string said, and this narrative set at
          121 characters a line. One explicit box, measured to a ~73-character median. */}
      <div className="mx-auto w-full max-w-[38rem]">
        <Reveal>
          <p className={eyebrow}>Our story</p>
          <h2 id="story-heading" className="sr-only">
            Why OneCommit exists
          </h2>
          <blockquote className="mt-5 text-balance text-[1.625rem] font-semibold leading-[1.2] tracking-[-0.025em] text-ink sm:text-[2.125rem] lg:text-[2.5rem]">
            {"“In early 2024, I started reaching out to college track programs. I had the times, the grades, the drive — but I had no idea which schools actually fit me athletically and academically.”"}
          </blockquote>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 space-y-5 text-[17px] leading-[1.65] text-ink-soft sm:text-[18px]">
          <p>
            {"I spent weeks manually Googling coach emails, copy-pasting the same intro letter over and over, and sending messages into the void. Most never got a reply. I had no system for tracking who I’d contacted, what they said, or when to follow up."}
          </p>
          <p>
            {"So I built one. What started as a quick script to organize my own outreach turned into a matching and email workflow that made the process clearer. I realized the problem wasn’t my ability — it was the system I was trying to navigate."}
          </p>
          <p>
            {"The recruiting system is built around the athletes who already have visibility. Everyone else gets left to figure it out alone, or pay for a service that posts a passive profile and waits. OneCommit exists to fix that."}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex items-center gap-4 border-t border-line pt-8">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green text-[13px] font-bold text-on-green">
            HK
          </span>
          <div>
            <div className="text-[15px] font-semibold text-ink">Hugh Kopittke</div>
            <div className="text-[13px] text-ink-soft">OneCommit Founder &middot; Student-Athlete</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
