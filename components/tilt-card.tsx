"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useTransform(my, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-5, 5])
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 22 })
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 22 })

  const glowX = useTransform(mx, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(my, [-0.5, 0.5], [0, 100])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(74,222,128,0.09) 0%, transparent 60%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
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
      style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 1000 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{ background: glowBg }}
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
      />
      {children}
    </motion.div>
  )
}
