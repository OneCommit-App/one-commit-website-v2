"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { faqData } from "@/components/faq-data"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

export default function FAQSection() {
  const [open, setOpen] = useState<number[]>([])
  const toggle = (i: number) => setOpen((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i])

  return (
    <motion.section
      id="faq"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-16 flex justify-center scroll-mt-20"
    >
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:flex-1 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-2 text-white/50 text-sm leading-relaxed">Everything you need to know about building your recruiting process with OneCommit.</p>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="lg:flex-1 flex flex-col"
        >
          {faqData.map((item, i) => {
            const isOpen = open.includes(i)
            return (
              <motion.div
                key={i}
                variants={fadeUpItem}
                animate={{
                  backgroundColor: isOpen ? "rgba(74,222,128,0.03)" : "transparent",
                  borderLeftColor: isOpen ? "rgba(74,222,128,0.35)" : "transparent",
                }}
                transition={{ duration: 0.25 }}
                className="border-b border-white/[0.06] border-l-2 pl-3 -ml-3"
              >
                <button
                  id={`faq-trigger-${i}`}
                  onClick={() => toggle(i)}
                  className="w-full py-4 flex items-center justify-between text-left group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span className={`text-sm font-medium pr-4 transition-colors duration-200 ${isOpen ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                    {item.q}
                  </span>
                  <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isOpen ? "text-[#4ade80]" : "text-white/30 group-hover:text-white/50"}`}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-white/50 text-sm leading-relaxed pb-4">{item.a}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
