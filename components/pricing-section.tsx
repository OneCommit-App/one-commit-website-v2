"use client"

import { motion } from "framer-motion"
import { useWaitlist } from "@/components/waitlist-dialog"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function PricingSection() {
  const { openWaitlist } = useWaitlist()

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-16 flex justify-center"
    >
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">Beta Pricing</span>
          <h2 className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Built for athletes, not budgets
          </h2>
          <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">
            {"Traditional recruiting services charge $3,000-$5,000+. OneCommit is free during beta -- and always affordable after."}
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Beta Free */}
          <motion.div
            variants={cardReveal}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/[0.04] border border-[#4ade80]/20 rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="text-[#4ade80] text-sm font-semibold mb-1">Beta Access</div>
              <p className="text-white/40 text-sm mb-4">Full access to all features during the beta period. No credit card required.</p>
              <div className="text-white text-5xl font-bold mb-1">$0</div>
              <div className="text-white/30 text-sm mb-5">free during beta</div>
              <button onClick={openWaitlist} className="block w-full h-10 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center justify-center hover:bg-white/90 transition-colors">
                Join the Track Beta
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              {[
                "Smart school matching (Reach/Target/Foundational)",
                "Personalized email generation",
                "Gmail & Outlook integration",
                "Coach reply tracking",
                "Outreach dashboard",
                "Preferences interview",
                "SmartAdd AI search",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="text-white/70 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Legacy */}
          <motion.div
            variants={cardReveal}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="text-white/40 text-sm font-semibold mb-1">Legacy Recruiting Services</div>
              <p className="text-white/30 text-sm mb-4">What the traditional services charge for profile-based recruiting.</p>
              <div className="text-white/60 text-5xl font-bold mb-1">$3-5k</div>
              <div className="text-white/20 text-sm mb-5">with no guarantee of results</div>
              <div className="w-full h-10 bg-white/[0.04] border border-white/[0.06] text-white/30 text-sm font-medium rounded-full flex items-center justify-center cursor-default">
                The old way
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              {[
                "Generic profile on a recruiting website",
                "Coaches have to find you (passive)",
                "Emails sent from a third-party platform",
                "Limited visibility into who views your profile",
                "No real-time engagement tracking",
                "One-size-fits-all approach",
                "You don't control the conversation",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" /></svg>
                  <span className="text-white/30 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
