"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"
import { useWaitlist } from "@/components/waitlist-dialog"

const plans = [
  {
    name: "Beta",
    eyebrow: "Waitlist open",
    description: "Join the waitlist for core recruiting workspace access as beta waves open.",
    price: "Free",
    cadence: "beta",
    note: "No credit card required to join the waitlist.",
    cta: "Join Beta Waitlist",
    variant: "standard",
    features: [
      "Smart school matching",
      "Personalized email generation",
      "Gmail and Outlook connection",
      "Coach reply tracking",
      "SmartAdd school search",
    ],
  },
  {
    name: "Pro",
    eyebrow: "Best for active recruiting",
    description: "Expanded workflow access plus strategy help from a OneCommit recruiting advisor when Pro opens.",
    price: "Planned",
    cadence: "pro beta",
    note: "Pricing and availability shared before any paid plan starts.",
    cta: "Join Pro Waitlist",
    variant: "featured",
    features: [
      "Monthly 1-on-1 advisor call",
      "Personalized profile review",
      "Pitch and follow-up coaching",
      "Unlimited coach outreach emails",
      "Unlimited school exploration",
      "Priority recruiting pipeline tools",
    ],
  },
]

const oldWay = [
  "Generic public profile",
  "Passive coach discovery",
  "Third-party platform messages",
  "Limited reply visibility",
  "Large upfront payment",
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const featureListStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
}

const featureItem = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
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
        <div className="text-center mb-8 scroll-mt-20">
          <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">Pricing</span>
          <h2 className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Join the beta. Upgrade when Pro access opens.
          </h2>
          <p className="mt-2 text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            OneCommit keeps the self-service tools accessible, then plans to add human strategy for athletes who need more help acting on replies.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)_minmax(250px,0.78fr)] gap-4"
        >
          {plans.map((plan) => {
            const featured = plan.variant === "featured"
            return (
              <motion.div
                key={plan.name}
                variants={cardReveal}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative flex flex-col rounded-xl border p-6 ${
                  featured
                    ? "bg-white/[0.055] border-[#4ade80]/35 shadow-[0_0_45px_rgba(74,222,128,0.07)]"
                    : "bg-white/[0.035] border-white/[0.08]"
                }`}
              >
                <div className="flex min-h-5 flex-wrap items-start justify-between gap-2">
                  <div className="text-[#86efac] text-xs font-semibold uppercase tracking-wider">{plan.eyebrow}</div>
                  {featured && (
                    <span className="rounded-full border border-[#4ade80]/25 bg-[#4ade80]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#86efac]">
                      Most useful
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-white text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 min-h-16 text-white/50 text-sm leading-relaxed">{plan.description}</p>

                <div className="mt-5">
                  <div className="flex items-end gap-2">
                    <span className="text-white text-5xl font-bold tracking-tight">{plan.price}</span>
                    <span className="pb-1 text-white/30 text-sm">{plan.cadence}</span>
                  </div>
                  <p className="mt-2 text-white/25 text-xs">{plan.note}</p>
                </div>

                <button
                  onClick={openWaitlist}
                  className={`mt-5 h-10 rounded-full text-sm font-semibold transition-colors ${
                    featured
                      ? "bg-white text-[#0f1a14] hover:bg-white/90"
                      : "bg-white/[0.06] border border-white/[0.10] text-white/70 hover:bg-white/[0.10] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>

                <motion.div
                  variants={featureListStagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="mt-6 flex flex-col gap-2"
                >
                  {plan.features.map((feature) => (
                    <motion.div key={feature} variants={featureItem} className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#86efac]" />
                      <span className="text-white/70 text-xs leading-relaxed">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )
          })}

          <motion.div
            variants={cardReveal}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <div className="text-white/30 text-xs font-semibold uppercase tracking-wider">Old way</div>
            <h3 className="mt-2 text-white/60 text-xl font-bold">Legacy recruiting services</h3>
            <p className="mt-2 text-white/30 text-sm leading-relaxed">
              Often high upfront fees for a passive profile-based model.
            </p>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-white/60 text-4xl font-bold tracking-tight">Thousands</span>
              <span className="pb-1 text-white/20 text-sm">upfront</span>
            </div>
            <div className="mt-5 h-10 rounded-full border border-white/[0.06] bg-white/[0.035] text-white/30 text-sm font-medium flex items-center justify-center">
              Compare the old way
            </div>
            <div className="mt-6 flex flex-col gap-2">
              {oldWay.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <XCircle size={14} className="mt-0.5 shrink-0 text-white/25" />
                  <span className="text-white/30 text-xs leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
