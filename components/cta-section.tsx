"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import DownloadLink from "@/components/download-link"
import TrackedLink from "@/components/tracked-link"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function CTASection() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-14 flex justify-center"
    >
      <motion.div
        whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
        className="w-full max-w-4xl bg-[#235d48]/20 border border-[#4ade80]/20 rounded-xl p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(135deg,rgba(74,222,128,0.10),transparent_42%,rgba(125,211,252,0.08))]" />

        <div className="relative z-10 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px] md:items-center">
          <div>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Start with the right college list. Then run the outreach.
            </h2>
            <p className="mt-3 text-white/50 text-sm sm:text-base max-w-xl leading-relaxed">
              Get OneCommit access to build your matched school list, draft personal coach emails, and track replies from one recruiting workspace.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <DownloadLink
                  analyticsSource="home_final_cta"
                  className="h-11 px-7 bg-white text-[#0f1a14] text-sm font-semibold rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors group relative overflow-hidden whitespace-nowrap"
                >
                  <span className="absolute inset-0 animate-shimmer" />
                  <span className="relative z-10">Download the App</span>
                  <ArrowRight size={15} className="relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </DownloadLink>
              </motion.div>
              <TrackedLink
                href="/demo"
                eventName="demo_click"
                eventSource="home_final_cta"
                className="h-11 px-6 border border-white/15 text-white text-sm font-medium rounded-full inline-flex items-center justify-center hover:bg-white/[0.04] transition-colors whitespace-nowrap"
              >
                Watch demo
              </TrackedLink>
            </div>
          </div>

          <div className="grid gap-2">
            {[
              "Get access and create a profile",
              "Gmail and Outlook outreach",
              "Track replies in one workspace",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/70">
                <CheckCircle2 size={15} className="shrink-0 text-[#86efac]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
