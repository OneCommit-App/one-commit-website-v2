"use client"

import { motion } from "framer-motion"

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
            <img src="/logo.ico" alt="OneCommit logo" className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
          </div>
          <p className="text-white/30 text-xs max-w-[200px] leading-relaxed">The first self-service recruiting copilot built for the overlooked.</p>
          <a href="mailto:onecommitapplication@gmail.com" className="text-[#4ade80] text-xs font-medium hover:underline">onecommitapplication@gmail.com</a>
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
