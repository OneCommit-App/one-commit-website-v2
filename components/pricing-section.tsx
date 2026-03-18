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

const featureListStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
}

const featureItem = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
}

const wordStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const wordChild = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const } },
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
          <motion.h2
            variants={wordStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance"
          >
            {["Why", "pay", "thousands", "for", "something", "you", "can", "do", "yourself?"].map((word, i) => (
              <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">
            {"Traditional services charge $3,000\u2013$5,000+ for a passive profile. OneCommit puts you in control \u2014 for free."}
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Beta Free — featured card */}
          <motion.div
            variants={cardReveal}
            animate={{
              boxShadow: [
                "0 0 0 1px rgba(74,222,128,0.12), 0 0 30px rgba(74,222,128,0.03)",
                "0 0 0 1px rgba(74,222,128,0.32), 0 0 60px rgba(74,222,128,0.10)",
                "0 0 0 1px rgba(74,222,128,0.12), 0 0 30px rgba(74,222,128,0.03)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/[0.04] border border-[#4ade80]/20 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              <motion.div
                animate={{ x: ["-100%", "220%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12"
              />
            </div>

            {/* Free Beta badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-full">
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0"
              />
              <span className="text-[#4ade80] text-[10px] font-semibold uppercase tracking-wider">Free Beta</span>
            </div>

            <div>
              <div className="text-[#4ade80] text-sm font-semibold mb-1">Beta Access</div>
              <p className="text-white/40 text-sm mb-4">Full access to all features during the beta period. No credit card required.</p>
              <div className="text-white text-5xl font-bold mb-1">$0</div>
              <div className="text-white/30 text-sm mb-1">free during beta</div>
              <div className="text-white/20 text-xs mb-4">No credit card. No commitment. Just results.</div>
              <button onClick={openWaitlist} className="block w-full h-10 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center justify-center hover:bg-white/90 transition-colors relative overflow-hidden group">
                <span className="absolute inset-0 animate-shimmer" />
                <span className="relative z-10">Join the Track Beta</span>
              </button>
            </div>
            <motion.div
              variants={featureListStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-6 flex flex-col gap-2"
            >
              {[
                "Smart school matching (Reach/Target/Foundational)",
                "Personalized email generation",
                "Gmail & Outlook integration",
                "Coach reply tracking",
                "Outreach dashboard",
                "Preferences interview",
                "SmartAdd AI search",
              ].map((f, i) => (
                <motion.div key={i} variants={featureItem} className="flex items-center gap-2.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span className="text-white/70 text-xs">{f}</span>
                </motion.div>
              ))}
            </motion.div>
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
            <motion.div
              variants={featureListStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-6 flex flex-col gap-2"
            >
              {[
                "Generic profile on a recruiting website",
                "Coaches have to find you (passive)",
                "Emails sent from a third-party platform",
                "Limited visibility into who views your profile",
                "No real-time engagement tracking",
                "One-size-fits-all approach",
                "You don't control the conversation",
              ].map((f, i) => (
                <motion.div key={i} variants={featureItem} className="flex items-center gap-2.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10M10 2L2 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" /></svg>
                  <span className="text-white/30 text-xs">{f}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Pro Plan — Coming Soon */}
          <motion.div
            variants={cardReveal}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 px-2 py-0.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-white/40 text-[10px] font-semibold uppercase tracking-wider">
              Coming Soon
            </div>
            <div>
              <div className="text-white/60 text-sm font-semibold mb-1">Pro Plan</div>
              <p className="text-white/30 text-sm mb-4">Everything in beta plus expanded features as OneCommit grows.</p>
              <div className="text-white/40 text-5xl font-bold mb-1">—</div>
              <div className="text-white/20 text-sm mb-5">beta users lock in early pricing</div>
              <button onClick={openWaitlist} className="block w-full h-10 bg-white/[0.06] border border-white/[0.10] text-white/50 text-sm font-medium rounded-full flex items-center justify-center hover:bg-white/[0.08] hover:text-white/70 transition-colors">
                Join beta to lock rate
              </button>
            </div>
            <motion.div
              variants={featureListStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-6 flex flex-col gap-2"
            >
              {[
                "Everything in beta",
                "Multi-sport support (roadmap)",
                "Priority school matching",
                "Advanced email analytics",
                "Unlimited outreach",
                "Dedicated onboarding",
                "Early access to new features",
              ].map((f, i) => (
                <motion.div key={i} variants={featureItem} className="flex items-center gap-2.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" /></svg>
                  <span className="text-white/30 text-xs">{f}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
