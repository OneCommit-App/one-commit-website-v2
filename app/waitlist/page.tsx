"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import WaitlistForm from "@/components/waitlist-form"

export default function WaitlistPage() {
  const [success, setSuccess] = useState(false)

  return (
    <div className="min-h-screen bg-[#0f1a14] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo + nav back */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
        className="mb-8"
      >
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.ico" alt="OneCommit logo" width={28} height={28} className="w-7 h-7 rounded-full" />
          <span className="text-white text-base font-semibold">OneCommit</span>
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.1 }}
        className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8"
      >
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <CheckCircle className="h-14 w-14 text-[#4ade80] mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">You&apos;re in.</h2>
            <p className="text-white/50 text-sm mb-6">We&apos;ll email you when your wave opens.</p>
            <Link
              href="/"
              className="h-10 px-6 bg-white/[0.06] border border-white/[0.08] text-white text-sm font-medium rounded-full inline-flex items-center hover:bg-white/[0.10] transition-colors"
            >
              Back to homepage
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-block px-3 py-1 mb-4 bg-white/[0.06] border border-white/[0.08] rounded-full">
                <span className="text-[#4ade80] text-xs font-medium">Track &amp; Field Beta</span>
              </div>
              <h1 className="text-white text-2xl font-bold tracking-tight">Join the Beta Waitlist</h1>
              <p className="mt-2 text-white/50 text-sm">Get early access to OneCommit for Track &amp; Field.</p>
            </div>

            <WaitlistForm
              layout="page"
              idPrefix="page"
              onSuccess={() => setSuccess(true)}
              showInlineSuccess={false}
            />
          </>
        )}
      </motion.div>

      {/* Back link */}
      {!success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5"
        >
          <Link href="/" className="text-white/40 text-xs hover:text-white/60 transition-colors">
            &larr; Back to homepage
          </Link>
        </motion.div>
      )}
    </div>
  )
}
