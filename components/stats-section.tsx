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

export default function StatsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="px-4 pb-14 flex justify-center"
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0 1px rgba(74,222,128,0.06), 0 0 40px rgba(74,222,128,0.02)",
            "0 0 0 1px rgba(74,222,128,0.18), 0 0 70px rgba(74,222,128,0.07)",
            "0 0 0 1px rgba(74,222,128,0.06), 0 0 40px rgba(74,222,128,0.02)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full max-w-3xl bg-white/[0.02] border border-white/[0.06] rounded-2xl px-6 py-12 sm:py-16"
      >
        <div className="flex flex-col sm:flex-row items-center justify-around gap-10 sm:gap-0 sm:divide-x sm:divide-white/[0.06]">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.14, ease: "easeOut" }}
              className="text-center flex flex-col items-center sm:flex-1 sm:px-8"
            >
              <div
                className="text-[#4ade80] text-6xl sm:text-7xl font-bold tracking-tight tabular-nums"
                style={{ textShadow: "0 0 40px rgba(74,222,128,0.4), 0 0 80px rgba(74,222,128,0.15)" }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/40 text-sm mt-2 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  )
}
