"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    quote: "I had no idea where I fit athletically or academically. OneCommit matched me with 40+ schools I never would have found on my own, and I committed within 4 months.",
    name: "Ethan R.",
    role: "HS Senior, 800m/1600m Runner",
  },
  {
    quote: "The emails OneCommit generated sounded like me, not some generic template. Three coaches replied within a week. That never happened when I was doing it myself.",
    name: "Maya L.",
    role: "HS Junior, Cross Country & Track",
  },
  {
    quote: "As a parent, I was about to spend $4,000 on a recruiting service. OneCommit gave my daughter more results in two weeks than we got from months of expensive consultants.",
    name: "David K.",
    role: "Parent of D3 Recruit",
  },
  {
    quote: "I\u2019m a mid-distance runner with decent but not elite times. OneCommit showed me D3 programs I didn\u2019t even know existed that were a perfect fit for my academics and athletics.",
    name: "Jordan T.",
    role: "HS Junior, 400m/800m",
  },
  {
    quote: "The SmartAdd feature is incredible. I typed \u2018small liberal arts colleges in the Northeast with strong academics\u2019 and it found exactly what I was looking for.",
    name: "Anika S.",
    role: "HS Senior, Distance Runner",
  },
  {
    quote: "My son sent out 25 emails in one afternoon and got 6 coach responses within a week. Before OneCommit, we spent three months trying to reach 10 schools manually.",
    name: "Lisa M.",
    role: "Parent of D3 Recruit",
  },
  {
    quote: "Being able to see my match percentage for every school made the whole process less overwhelming. I focused on my top targets and it paid off.",
    name: "Tyler W.",
    role: "HS Senior, Sprinter/Jumper",
  },
  {
    quote: "I was completely lost in the recruiting process. OneCommit broke it down into daily goals and I just followed the steps. Two months later, I had three offers.",
    name: "Camille B.",
    role: "HS Senior, 5K/10K Runner",
  },
  {
    quote: "The fact that emails come from MY inbox is a game changer. Coaches see a real student reaching out, not some recruiting platform. Way more authentic.",
    name: "Marcus J.",
    role: "HS Junior, Thrower",
  },
  {
    quote: "I\u2019m a sprinter from a small town with no recruiting connections. OneCommit leveled the playing field. I\u2019m now talking to 8 programs I never knew existed.",
    name: "Destiny H.",
    role: "HS Junior, 100m/200m",
  },
  {
    quote: "The reply tracking dashboard keeps everything organized. I know exactly which coaches responded, which are pending, and when to follow up.",
    name: "Chris P.",
    role: "HS Senior, Pole Vault",
  },
  {
    quote: "We tried NCSA and it felt like we were just waiting for coaches to find us. With OneCommit, my daughter took control and started conversations herself.",
    name: "Robert A.",
    role: "Parent of D3 Recruit",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [mounted])

  const go = (i: number) => {
    setActive(i)
  }

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="px-4 pb-14 flex justify-center"
    >
      <div className="w-full max-w-3xl bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 sm:p-10">
        <div className="flex items-center gap-1.5 mb-5 flex-wrap">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "bg-[#4ade80] w-5" : "bg-white/10 hover:bg-white/20 w-2"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <div className="min-h-[120px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <p className="text-white text-lg sm:text-xl font-medium leading-relaxed tracking-tight">
                {`\u201C${testimonials[active].quote}\u201D`}
              </p>
              <div className="mt-4">
                <div className="text-[#4ade80] text-sm font-semibold">{testimonials[active].name}</div>
                <div className="text-white/40 text-sm">{testimonials[active].role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-5 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => go((active - 1 + testimonials.length) % testimonials.length)}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/[0.04] transition-colors"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => go((active + 1) % testimonials.length)}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/[0.04] transition-colors"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.section>
  )
}
