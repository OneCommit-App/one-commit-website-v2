"use client"

import { motion } from "framer-motion"

const proofPoints = [
  {
    value: "40+",
    label: "matched schools",
    desc: "A balanced list across Reach, Target, and Foundational tiers.",
  },
  {
    value: "Gmail + Outlook",
    label: "own-inbox outreach",
    desc: "Coach emails are sent from the athlete's real account.",
  },
  {
    value: "Pro",
    label: "advisor waitlist",
    desc: "Strategy support planned for invited beta access waves.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function StatsSection() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-14 flex justify-center"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {proofPoints.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUpItem}
            whileHover={{ y: -4, boxShadow: "0 0 0 1px rgba(74,222,128,0.25), 0 0 24px rgba(74,222,128,0.06)" }}
            transition={{ duration: 0.2 }}
            className="min-h-[150px] rounded-xl border border-white/[0.06] bg-white/[0.025] p-5"
          >
            <div className="text-[#4ade80] text-3xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              {stat.value}
            </div>
            <div className="mt-2 text-white text-sm font-semibold">{stat.label}</div>
            <p className="mt-2 text-white/40 text-xs leading-relaxed">{stat.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
