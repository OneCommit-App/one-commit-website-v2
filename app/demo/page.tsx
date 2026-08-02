"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import DownloadLink from "@/components/download-link"

export default function DemoPage() {
  const shouldReduceMotion = useReducedMotion()

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
            <Image src="/logo.png" alt="OneCommit logo" width={24} height={24} className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="Back to home"
              className="h-7 px-3 border border-white/15 text-white text-xs font-medium rounded-full flex items-center gap-1.5 hover:bg-white/[0.04] transition-colors"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <DownloadLink
              analyticsSource="demo_nav"
              fallbackLabel="Request Access"
              className="h-7 px-3 bg-white text-[#0f1a14] text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-white/90 transition-colors"
            >
              Download
              <ArrowRight size={12} />
            </DownloadLink>
          </div>
        </div>
      </motion.nav>

      {/* Demo Video */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-28 pb-16 px-4 flex flex-col items-center"
      >
        <div className="text-center mb-6 max-w-xl">
          <span className="text-[#4ade80] text-xs font-medium">Product Demo</span>
          <h1 className="mt-2 text-white text-2xl sm:text-3xl font-bold tracking-tight">
            See OneCommit in action
          </h1>
          <p className="mt-2 text-white/50 text-sm">
            A one-minute walkthrough of D3-focused OneScore matches, own-inbox outreach, and reply tracking.
          </p>
          <DownloadLink
            analyticsSource="demo_intro"
            className="mt-5 h-10 px-6 bg-white text-[#0f1a14] text-sm font-semibold rounded-full inline-flex items-center gap-2 hover:bg-white/90 transition-colors"
          >
            Download the App
            <ArrowRight size={14} />
          </DownloadLink>
        </div>

        <div className="w-full max-w-3xl rounded-lg overflow-hidden border border-white/[0.08] bg-black/20 shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
          <video
            autoPlay={!shouldReduceMotion}
            loop={!shouldReduceMotion}
            muted
            playsInline
            controls
            poster="/demo-poster.png"
            preload="metadata"
            aria-label="OneCommit product demo video"
            className="w-full aspect-square object-cover block"
          >
            <source src="/demo.mp4" type="video/mp4" />
            <track src="/demo.vtt" kind="captions" label="English" default />
          </video>
        </div>

        <DownloadLink
          analyticsSource="demo_page"
          className="mt-8 h-10 px-6 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors"
        >
          Download the App
          <ArrowRight size={14} />
        </DownloadLink>
      </motion.section>
    </div>
  )
}
