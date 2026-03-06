"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const faqData = [
  { q: "What is OneCommit and who is it for?", a: "OneCommit is a self-service recruiting copilot built for high school Track & Field athletes. It helps you find matched colleges, generate personalized outreach emails, and track coach replies — all in one place." },
  { q: "How does the school matching work?", a: "When you create your profile, you enter your times/marks, GPA, SAT scores, and what you care about in a college. OneCommit analyzes this against hundreds of programs and generates a match percentage for each school, labeled as Reach, Target, or Foundational." },
  { q: "Do the emails come from my own inbox?", a: "Yes. OneCommit integrates with your Gmail or Outlook account. Emails go out from your real email address, so coaches see a genuine person reaching out — not a third-party platform." },
  { q: "Will coaches know the email was AI-generated?", a: "No. OneCommit generates emails in your voice based on your profile — your times, your story, your school preferences. The email comes from your inbox and reads like you wrote it. Coaches just see a student reaching out directly." },
  { q: "Can I use OneCommit if I'm already talking to coaches?", a: "Absolutely. You can add schools you're already in contact with to your dashboard and use OneCommit to track those conversations, set follow-up reminders, and generate additional outreach to new programs alongside existing ones." },
  { q: "What if a school I want isn't in the database?", a: "You can add any school manually using SmartAdd. Just type what you're looking for — \"D3 schools in the Midwest with strong biology programs\" — or search directly by name and add it to your dashboard." },
  { q: "How many schools should I reach out to?", a: "Most athletes see the best results reaching out to 20–40 schools across all three tiers (Reach, Target, Foundational). OneCommit helps you build this list and batch your outreach so it doesn't feel overwhelming." },
  { q: "Is my data private? Who sees my profile?", a: "Only you see your profile information. OneCommit doesn't share your data with coaches, recruiting platforms, or third parties. Coaches only hear from you if you choose to send them an email." },
  { q: "What sports does OneCommit support?", a: "Right now, the beta is Track & Field only (including Cross Country). We're focused on getting this right for one sport before expanding to others." },
  { q: "What email providers are supported?", a: "Currently Gmail and Outlook/Microsoft 365 are supported. These cover the vast majority of student email accounts." },
  { q: "How much does OneCommit cost?", a: "OneCommit is free during the beta period. We're offering limited spots to early users at no cost. After the beta, pricing will be significantly more affordable than traditional recruiting services — think a monthly subscription, not a multi-thousand dollar package." },
  { q: "How is this different from NCSA or CaptainU?", a: "Traditional services create a profile and wait for coaches to find you. OneCommit flips the script — you're the one reaching out, from your own email, with personalized messages. You control the timeline, strategy, and conversation." },
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
                <button onClick={() => toggle(i)} className="w-full py-4 flex items-center justify-between text-left group" aria-expanded={isOpen}>
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
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/50 text-sm leading-relaxed pb-4">{item.a}</p>
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
