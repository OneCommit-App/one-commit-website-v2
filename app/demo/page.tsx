"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="w-full min-h-screen bg-[#0f1a14]">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <div className="w-full max-w-2xl h-11 px-4 pr-2 bg-[#0f1a14]/80 backdrop-blur-xl border border-white/[0.08] rounded-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/logo.ico" alt="OneCommit logo" className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
          </Link>
          <Link
            href="/"
            className="h-7 px-4 border border-white/15 text-white text-xs font-medium rounded-full flex items-center hover:bg-white/[0.04] transition-colors"
          >
            Back to home
          </Link>
        </div>
      </motion.nav>

      {/* Demo Video */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-28 pb-16 px-4 flex flex-col items-center"
      >
        <div className="text-center mb-8 max-w-xl">
          <span className="text-[#4ade80] text-xs font-medium">Product Demo</span>
          <h1 className="mt-2 text-white text-2xl sm:text-3xl font-bold tracking-tight">
            See OneCommit in action
          </h1>
          <p className="mt-2 text-white/50 text-sm">
            Watch how we turn your stats into matched schools, outreach emails, and reply tracking.
          </p>
        </div>

        <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/[0.08] bg-black/20 shadow-[0_0_80px_rgba(74,222,128,0.06)]">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full h-auto block"
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
        </div>

        <Link
          href="/"
          className="mt-8 h-10 px-6 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center hover:bg-white/90 transition-colors"
        >
          Join the Beta
        </Link>
      </motion.section>
    </div>
  )
}
