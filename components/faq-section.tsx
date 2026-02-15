"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const faqData = [
  { q: "What is OneCommit and who is it for?", a: "OneCommit is a self-service recruiting copilot built for high school Track & Field athletes. It helps you find matched colleges, generate personalized outreach emails, and track coach replies -- all in one place." },
  { q: "How does the school matching work?", a: "When you create your profile, you enter your times/marks, GPA, SAT scores, and what you care about in a college. OneCommit analyzes this against hundreds of programs and generates a match percentage for each school, labeled as Reach, Target, or Foundational." },
  { q: "Do the emails come from my own inbox?", a: "Yes! OneCommit integrates with your Gmail or Outlook account. Emails go out from your real email address, so coaches see a genuine person reaching out -- not a third-party platform." },
  { q: "What sports does OneCommit support?", a: "Right now, the beta is Track & Field only (including Cross Country). We're focused on getting this right for one sport before expanding." },
  { q: "How much does OneCommit cost?", a: "OneCommit is free during the beta period. We're offering limited spots to early users at no cost. After the beta, pricing will be significantly more affordable than traditional recruiting services." },
  { q: "How is this different from NCSA or CaptainU?", a: "Traditional services create a profile and wait for coaches to find you. OneCommit flips the script -- you're the one reaching out, from your own email, with personalized messages. You control the timeline, strategy, and conversation." },
]

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
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-16 flex justify-center"
    >
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:flex-1 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-2 text-white/50 text-sm leading-relaxed">Everything you need to know about getting recruited with OneCommit.</p>
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
              <motion.div key={i} variants={fadeUpItem} className="border-b border-white/[0.06]">
                <button onClick={() => toggle(i)} className="w-full py-4 flex items-center justify-between text-left group" aria-expanded={isOpen}>
                  <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                  <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-5 h-5 text-white/30 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/40 text-sm leading-relaxed pb-4">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
