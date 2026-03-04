"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: 500, suffix: "+", label: "Athletes Matched" },
  { value: 40, suffix: "+", label: "Schools Per Athlete" },
  { value: 200, suffix: "+", label: "Coach Replies Tracked" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = Math.max(1, Math.floor(target / 40))
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setCount(current)
    }, 25)
    return () => clearInterval(interval)
  }, [inView, target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function StatsSection() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-14 flex justify-center"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full max-w-3xl grid grid-cols-3 divide-x divide-white/[0.06]"
      >
        {stats.map((stat, i) => (
          <motion.div key={i} variants={fadeUpItem} className="text-center py-4 px-2">
            <div className="text-[#4ade80] text-3xl sm:text-4xl font-bold tracking-tight">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-white/50 text-xs sm:text-sm mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
