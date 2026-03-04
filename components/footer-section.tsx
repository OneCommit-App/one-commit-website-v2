"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function FooterSection() {
  return (
    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="px-4 pt-8 pb-12 flex justify-center border-t border-white/[0.06]"
    >
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image src="/logo.ico" alt="OneCommit logo" width={24} height={24} className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
          </div>
          <p className="text-white/30 text-xs max-w-[200px] leading-relaxed">The first self-service recruiting copilot built for the overlooked.</p>
          <a href="mailto:onecommitapplication@gmail.com" className="text-[#4ade80] text-xs font-medium hover:underline">onecommitapplication@gmail.com</a>
          <div className="flex items-center gap-3 mt-1">
            <motion.a
              href="https://x.com/onecommit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30"
              whileHover={{ scale: 1.2, color: "#4ade80" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label="X / Twitter"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </motion.a>
            <motion.a
              href="https://instagram.com/onecommit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30"
              whileHover={{ scale: 1.2, color: "#4ade80" }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label="Instagram"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </motion.a>
          </div>
        </div>

        <div className="flex gap-12 sm:gap-16">
          <div className="flex flex-col gap-2">
            <span className="text-white/20 text-xs font-semibold uppercase tracking-wider">Product</span>
            <a href="#features" className="text-white/50 text-xs hover:text-white/70 transition-colors">Features</a>
            <a href="#how-it-works" className="text-white/50 text-xs hover:text-white/70 transition-colors">How It Works</a>
            <a href="#pricing" className="text-white/50 text-xs hover:text-white/70 transition-colors">Pricing</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white/20 text-xs font-semibold uppercase tracking-wider">Company</span>
            <span className="text-white/50 text-xs">Our Story</span>
            <a href="mailto:onecommitapplication@gmail.com" className="text-white/50 text-xs hover:text-white/70 transition-colors">Contact</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white/20 text-xs font-semibold uppercase tracking-wider">Legal</span>
            <a href="/privacy" className="text-white/50 text-xs hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-white/50 text-xs hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
