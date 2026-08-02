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
      className="border-y border-white/[0.07] bg-[#17251e] px-4 py-14 flex justify-center"
    >
      <motion.div
        className="w-full max-w-4xl"
      >
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px] md:items-center">
          <div>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
              Build your college list. Then run the outreach.
            </h2>
            <p className="mt-3 text-white/50 text-sm sm:text-base max-w-xl leading-relaxed">
              Request a OneCommit beta invitation to build a D3-focused OneScore list, draft personal coach emails, and track replies from one recruiting workspace.
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
              "Request an invitation, then create a profile",
              "Gmail and Outlook outreach",
              "Track replies in one workspace",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 py-1 text-sm text-white/70">
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
