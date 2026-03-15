"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useWaitlist } from "@/components/waitlist-dialog"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

type Particle = { id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number }

/* Floating ambient particles for the CTA background */
function AmbientParticles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.5,
        duration: Math.random() * 6 + 6,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.3 + 0.1,
      }))
    )
  }, [])

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -18, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#4ade80",
            pointerEvents: "none",
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  )
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
        className="w-full max-w-4xl bg-[#235d48]/20 border border-[#235d48]/30 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
      >
        {/* Animated ambient particles */}
        <AmbientParticles />

        {/* Radial glow center */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(74,222,128,0.07) 0%, transparent 70%)" }} />

        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance relative z-10">
          Take control of your recruiting
        </h2>
        <p className="mt-3 text-white/50 text-sm sm:text-base max-w-md mx-auto leading-relaxed relative z-10">
          Stop waiting to be found. Join the beta and start connecting with programs that fit you.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 relative z-10">
          <motion.button
            onClick={openWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="h-11 px-10 bg-white text-[#0f1a14] text-sm font-semibold rounded-full inline-flex items-center gap-2 hover:bg-white/90 transition-colors group relative overflow-hidden"
          >
            <span className="absolute inset-0 animate-shimmer" />
            <span className="relative z-10">Join the Track Beta</span>
            <ArrowRight size={15} className="relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.button>
          <p className="text-white/30 text-xs">
            Join 500+ athletes already on the waitlist &mdash; free during beta
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
