"use client"

import { Check, X } from "lucide-react"
import { container, eyebrow, h2, lede, section } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

const problems = [
  {
    problem: "You’re guessing which schools are realistic",
    answer: "OneScore helps you compare fit across the current D3 beta dataset.",
  },
  {
    problem: "Your outreach is scattered across drafts and inboxes",
    answer: "Emails go from your own inbox, while OneCommit helps you keep the process organized.",
  },
  {
    problem: "You shouldn’t need a large upfront package",
    answer:
      "OneCommit starts with a free beta invitation when capacity and a supported app-access path are available.",
  },
  {
    problem: "Waiting on coaches to notice you isn’t a strategy",
    answer: "You choose who to contact and review every message before it sends.",
  },
]

export default function ProblemSection() {
  return (
    <section aria-labelledby="problem-heading" className={section}>
      <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className={eyebrow}>The problem</p>
          <h2 id="problem-heading" className={`mt-4 ${h2}`}>
            The recruiting system isn&rsquo;t built for you.
          </h2>
          <p className={`mt-4 max-w-md ${lede}`}>
            Unless you&rsquo;re a blue-chip recruit, you&rsquo;re on your own. We&rsquo;re changing that.
          </p>
        </Reveal>

        <RevealGroup className="border-t border-line">
          {problems.map((item) => (
            <RevealItem key={item.problem} className="grid gap-4 border-b border-line py-7 sm:grid-cols-2 sm:gap-8">
              <div className="flex gap-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-soft text-clay">
                  <X size={14} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <p className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                  <span className="sr-only">Problem: </span>
                  {item.problem}
                </p>
              </div>
              <div className="flex gap-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
                  <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <p className="text-[16px] leading-relaxed text-ink-soft">
                  <span className="sr-only">With OneCommit: </span>
                  {item.answer}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
