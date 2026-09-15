"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import { faqData } from "@/components/faq-data"
import { container, eyebrow, focusRing, h2, lede, section } from "@/components/home/tokens"
import { EASE_OUT, Reveal, RevealGroup, RevealItem } from "@/components/reveal"

export default function FAQSection() {
  const [open, setOpen] = useState<number[]>([])
  const toggle = (index: number) =>
    setOpen((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]))

  return (
    <section id="faq" aria-labelledby="faq-heading" className={`${section} scroll-mt-20`}>
      <div className={`${container} grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className={eyebrow}>FAQ</p>
          <h2 id="faq-heading" className={`mt-4 ${h2}`}>
            Frequently asked questions.
          </h2>
          <p className={`mt-4 max-w-sm ${lede}`}>
            Everything you need to know about building your recruiting process with OneCommit.
          </p>
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
