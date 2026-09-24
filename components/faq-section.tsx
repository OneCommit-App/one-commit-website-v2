"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import { faqData } from "@/components/faq-data"
import { container, eyebrow, focusRing, h3Section, lede, section } from "@/components/home/tokens"
import { EASE_OUT, Reveal, RevealGroup, RevealItem } from "@/components/reveal"

export default function FAQSection() {
  // The first row opens on load. Closed, this band is twelve identical rows and a
  // reader never sees what an answer looks like before deciding whether to open one.
  // It is a list of <button>s with aria-expanded, not a disclosure that traps focus,
  // so an open row costs nothing to a keyboard or screen-reader user.
  const [open, setOpen] = useState<number[]>([0])
  const toggle = (index: number) =>
    setOpen((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]))

  return (
    <section id="faq" aria-labelledby="faq-heading" className={`${section} scroll-mt-20`}>
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className={eyebrow}>FAQ</p>
          <h2 id="faq-heading" className={`mt-4 ${h3Section}`}>
            Frequently asked questions.
          </h2>
          <p className={`mt-4 max-w-sm ${lede}`}>
            Everything you need to know about building your recruiting process with OneCommit.
          </p>
          {/* This column is sticky and held a heading and two lines above roughly 900px
              of nothing — the largest empty rectangle on the page. The address is
              already in the last FAQ answer and in the footer, but both are hidden: one
              behind a plus, one below 12,000px of scroll. Here it travels with the list,
              so it is on screen at the exact moment a reader finds their question is
              not in it. No response-time or headcount promise — neither is backed. */}
          <div className="oc-lane-top mt-10 max-w-sm border-t border-line pt-8">
            <p className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Not on the list?</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              Send the question straight to us. Every message goes to a person, not a ticket queue.
            </p>
            <a
              href="mailto:admin@onecommit.us"
              className={`mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-green transition-colors hover:text-green-mid ${focusRing}`}
            >
              admin@onecommit.us
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <RevealGroup stagger={0.04} className="border-t border-line">
          {faqData.map((item, index) => {
            const isOpen = open.includes(index)
            return (
              <RevealItem key={item.q} y={12} className="border-b border-line">
                <button
                  id={`faq-trigger-${index}`}
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className={`group flex min-h-11 w-full items-center justify-between gap-6 rounded-input py-5 text-left ${focusRing}`}
                >
                  <span className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-ink">{item.q}</span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                      isOpen
                        ? "bg-green text-on-green"
                        : "bg-canvas-subtle text-ink-soft group-hover:bg-green-soft group-hover:text-green"
                    }`}
                  >
                    <Plus size={16} />
                  </motion.span>
                </button>
                <motion.div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-ink-soft">{item.a}</p>
                </motion.div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
