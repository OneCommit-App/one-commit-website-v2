"use client"

import { motion } from "framer-motion"
import { useWaitlist } from "@/components/waitlist-dialog"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function CTASection() {
  const { openWaitlist } = useWaitlist()

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
        className="w-full max-w-3xl bg-[#235d48]/20 border border-[#235d48]/30 rounded-2xl p-8 sm:p-12 text-center"
      >
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
          Take control of your recruiting
        </h2>
        <p className="mt-3 text-white/50 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Stop waiting to be found. Join the beta and start connecting with programs that fit you.
        </p>
        <div className="mt-6">
          <motion.button
            onClick={openWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="h-11 px-10 bg-white text-[#0f1a14] text-sm font-semibold rounded-full inline-flex items-center hover:bg-white/90 transition-colors"
          >
            Join the Track Beta
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  )
}
