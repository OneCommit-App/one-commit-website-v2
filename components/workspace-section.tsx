"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const useCases = [
  {
    badge: "Athletes",
    title: "Build a list you can defend",
    body: "Turn PRs, grades, location, and school preferences into a school list that explains why each program belongs there.",
    checks: ["OneScore by school", "Academic and athletic context", "D3-focused beta dataset"],
  },
  {
    badge: "Parents",
    title: "See the whole process in one place",
    body: "Keep the recruiting process organized without becoming the family spreadsheet manager.",
    checks: ["Saved schools", "Sent outreach", "Reply status"],
  },
  {
    badge: "Outreach",
    title: "Send emails that sound like a real athlete",
    body: "Draft personalized messages from the athlete's own profile, then send them through Outlook/Microsoft 365, the inbox provider currently offered in the beta app.",
    checks: ["Own-inbox delivery", "Personal context", "No passive profile waiting"],
  },
  {
    badge: "Onboarding",
    title: "Talk it through with Riley",
    body: "Use the Riley voice conversation to build an athlete profile, then review the captured details before moving on.",
    checks: ["Voice-guided setup", "Athlete-confirmed details", "Profile review before outreach"],
  },
]

const workflow = [
  "Profile",
  "OneScore",
  "Outreach",
  "Replies",
  "Review",
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

export default function WorkspaceSection() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-14 flex justify-center"
    >
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center">
          <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">Recruiting Workspace</span>
          <h2 className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Built for the messy middle of recruiting
          </h2>
          <p className="mt-2 text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            OneCommit keeps the parts families usually scatter across notes, spreadsheets, inboxes, and memory in one focused workflow.
          </p>
        </div>

        <div className="mb-4 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
          <div className="grid grid-cols-5 gap-2">
            {workflow.map((step, i) => (
              <div key={step} className="relative flex min-h-16 items-center justify-center rounded-lg bg-white/[0.035] px-2 text-center">
                {i < workflow.length - 1 && (
                  <span className="absolute -right-2 top-1/2 z-10 hidden h-px w-2 bg-[#4ade80]/30 sm:block" />
                )}
                <div>
                  <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4ade80]/10 text-[10px] font-bold text-[#86efac]">
                    {i + 1}
                  </div>
                  <div className="text-[11px] font-semibold text-white/70">{step}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {useCases.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUpItem}
              whileHover={{
                y: -5,
                borderColor: "rgba(74,222,128,0.24)",
                boxShadow: "0 0 28px rgba(74,222,128,0.07)",
                transition: { duration: 0.22 },
              }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-5"
            >
              <span className="inline-flex rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#86efac]">
                {item.badge}
              </span>
              <h3 className="mt-3 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
              <div className="mt-4 grid gap-2">
                {item.checks.map((check) => (
                  <div key={check} className="flex items-center gap-2.5 text-xs text-white/70">
                    <CheckCircle2 size={14} className="shrink-0 text-[#86efac]" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
