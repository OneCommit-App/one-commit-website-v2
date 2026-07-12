"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"
import DownloadLink from "@/components/download-link"

const plans = [
  {
    name: "Beta",
    eyebrow: "App access",
    description: "Get OneCommit access for the core recruiting workspace during beta.",
    price: "Free",
    cadence: "during beta",
    note: "No credit card required to create a beta account.",
    cta: "Get App Access",
    ctaType: "download",
    features: [
      "D3-focused OneScore matching",
      "Riley voice or typed onboarding",
      "Personalized email generation",
      "Gmail and Outlook connection",
      "Coach reply tracking",
    ],
  },
  {
    name: "Paid plans",
    eyebrow: "Not live",
    description: "There is no paid tier, advisor subscription, or recurring call package available today.",
    price: "TBD",
    cadence: "after validation",
    note: "Any future price and terms will be shown before billing can start.",
    cta: "",
    ctaType: "none",
    features: [
      "No checkout in the current beta",
      "No public paid price yet",
      "Beta outcomes will shape future plans",
      "Terms shown before any purchase",
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
          <span className="text-[#4ade80] text-xs font-semibold uppercase">Beta access</span>
          <h2 className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
            Free during beta. No paid plan is live.
          </h2>
          <p className="mt-2 text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            We are validating the athlete workflow before publishing a price or asking anyone to subscribe.
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
            return (
              <motion.div
                key={plan.name}
                variants={cardReveal}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative flex flex-col rounded-lg border border-white/[0.08] bg-white/[0.035] p-6"
              >
                <div className="flex min-h-5 flex-wrap items-start justify-between gap-2">
                  <div className="text-[#86efac] text-xs font-semibold uppercase">{plan.eyebrow}</div>
                </div>
                <h3 className="mt-2 text-white text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 min-h-16 text-white/50 text-sm leading-relaxed">{plan.description}</p>

                <div className="mt-5">
                  <div className="flex items-end gap-2">
                    <span className="text-white text-5xl font-bold">{plan.price}</span>
                    <span className="pb-1 text-white/30 text-sm">{plan.cadence}</span>
                  </div>
                  <p className="mt-2 text-white/25 text-xs">{plan.note}</p>
                </div>

                {plan.ctaType === "download" ? (
                  <DownloadLink
                    analyticsSource="pricing_beta"
                    className="mt-5 h-10 rounded-full border border-white/[0.10] bg-white/[0.06] text-sm font-semibold text-white/70 transition-colors inline-flex items-center justify-center hover:bg-white/[0.10] hover:text-white"
                  >
                    {plan.cta}
                  </DownloadLink>
                ) : null}

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
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <div className="text-white/30 text-xs font-semibold uppercase">Old way</div>
            <h3 className="mt-2 text-white/60 text-xl font-bold">Legacy recruiting services</h3>
            <p className="mt-2 text-white/30 text-sm leading-relaxed">
              Often high upfront fees for a passive profile-based model.
            </p>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-white/60 text-4xl font-bold">High fees</span>
              <span className="pb-1 text-white/20 text-sm">upfront</span>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase text-white/25">Typical legacy model</p>
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
