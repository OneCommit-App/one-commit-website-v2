"use client"

import { useState, useEffect } from "react"
import { motion, useInView, useAnimate } from "framer-motion"

const stats = [
  { value: 500, suffix: "+", label: "Athletes Matched" },
  { value: 40, suffix: "+", label: "Schools Per Athlete" },
  { value: 200, suffix: "+", label: "Coach Replies Tracked" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const [scope, animate] = useAnimate()
  const inView = useInView(scope, { once: true, margin: "-80px" })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = Math.max(1, Math.floor(target / 40))
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
        if (scope.current) {
          animate(scope.current, { scale: [1, 1.15, 1] }, { duration: 0.4, ease: "easeInOut" })
        }
      }
      setCount(current)
    }, 25)
    return () => clearInterval(interval)
  }, [inView, target, animate, scope])

  return (
    <span ref={scope}>
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
        className="w-full max-w-4xl grid grid-cols-3 gap-3"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={fadeUpItem}
            whileHover={{ y: -4, boxShadow: "0 0 0 1px rgba(74,222,128,0.25), 0 0 24px rgba(74,222,128,0.06)" }}
            transition={{ duration: 0.2 }}
            className="text-center py-6 px-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl"
          >
            <div className="text-[#4ade80] text-4xl sm:text-5xl font-bold tracking-tight">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-white/40 text-xs sm:text-sm mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
