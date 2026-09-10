"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"

/** Calm, physical ease shared by every homepage motion. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const

export const viewportOnce = { once: true, margin: "-64px 0px" } as const

export function staggerVariants(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
}

/**
 * True only after mount when the visitor prefers reduced motion. Safe to branch
 * inline styles on: server and first client render agree (false), so there is no
 * hydration mismatch, and scroll-linked transforms then settle to their static state.
 */
export function useStill(): boolean {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return Boolean(mounted && reduce)
}

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}

/** Fade + rise once when scrolled into view (translate/opacity only). */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT, delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type RevealGroupProps = {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
}

/** Container whose `RevealItem` children rise in sequence. */
export function RevealGroup({ children, className, stagger = 0.08, delay = 0 }: RevealGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerVariants(stagger, delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className, y = 20 }: Omit<RevealProps, "delay">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
