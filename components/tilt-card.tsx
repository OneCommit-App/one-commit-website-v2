"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion"
import { useStill } from "@/components/reveal"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

/** Pointer-following tilt with a soft green sheen. Static for reduced motion and coarse pointers. */
export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const still = useStill()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useTransform(my, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-4, 4])
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 24 })
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 24 })

  const glowX = useTransform(mx, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(my, [-0.5, 0.5], [0, 100])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(31,122,86,0.10) 0%, transparent 60%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || still) return
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={still ? undefined : { rotateX: springRX, rotateY: springRY, transformPerspective: 1000 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{ background: glowBg }}
        className="pointer-events-none absolute inset-0 z-10 rounded-card"
      />
      {children}
    </motion.div>
  )
}
