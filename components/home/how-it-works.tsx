"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import DeviceFrame from "@/components/device-frame"
import { eyebrow, focusRing, h2 } from "@/components/home/tokens"
import { EASE_OUT, useStill } from "@/components/reveal"

const steps = [
  {
    title: "Build your athlete profile",
    desc: "Talk through your marks, academics, and preferences with Riley, then review the profile details.",
    image: "/app/profile.png",
    alt: "OneCommit profile screen with marks, GPA, target, and OneScore readiness",
  },
  {
    title: "Review OneScore matches",
    desc: "Compare D3 programs using your marks, academics, and college preferences.",
    image: "/app/explore.png",
    alt: "OneCommit Explore screen scoring a program against the athlete's profile",
  },
  {
    title: "Send outreach emails",
    desc: "Generate personalized emails and send them from your own inbox.",
    image: "/app/pipeline.png",
    alt: "OneCommit Pipeline screen with saved schools and an inbox connection prompt",
  },
  {
    title: "Track coach replies",
    desc: "See who replied, manage threads, and plan the next follow-up from your outreach history.",
    image: "/app/home.png",
    alt: "OneCommit home screen with the queue of matches, sent messages, and replies",
  },
  {
    title: "Keep improving",
    desc: "Use reply history and follow-up reminders to make your next move clearer.",
    image: "/app/brief.png",
    alt: "OneCommit Brief screen listing today's recruiting tasks",
  },
]

const phoneSizes = "(max-width: 1024px) 200px, 340px"

/* The pinned panel fills the viewport up to 56rem; each step scrolls for at most 40rem. */
const panelHeight = "min(100svh, 56rem)"
const stepTravel = "min(80svh, 40rem)"

/**
 * Sticky scrollytelling: the panel pins for one viewport per step while the phone
 * screen crossfades through the five steps and the matching copy highlights.
 * Reduced motion: nothing pins; steps are plain buttons that swap the screen.
 */
export default function HowItWorks() {
  const still = useStill()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] })

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(progress * steps.length)))
    setActive((current) => (current === next ? current : next))
  })

  const goTo = useCallback(
    (index: number) => {
      setActive(index)
      const wrap = wrapRef.current
      if (!wrap || still) return
      const top = wrap.getBoundingClientRect().top + window.scrollY
      const travel = wrap.offsetHeight - window.innerHeight
      if (travel <= 0) return
      window.scrollTo({ top: top + (travel * (index + 0.5)) / steps.length, behavior: "smooth" })
    },
    [still],
  )

  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 overflow-x-clip bg-canvas px-4 sm:px-6">
      <div
        ref={wrapRef}
        style={{ height: still ? "auto" : `calc(${panelHeight} + ${steps.length} * ${stepTravel})` }}
        className="relative mx-auto w-full max-w-6xl"
      >
        <div
          style={still ? undefined : { top: `calc((100svh - ${panelHeight}) / 2)`, height: panelHeight }}
          className={still ? "py-24 lg:py-32" : "sticky flex flex-col justify-start pb-8 pt-20 lg:justify-center lg:py-16"}
        >
          <div className="grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            {/* Copy: heading plus the desktop step list */}
            <div>
              <p className={eyebrow}>How it works</p>
              <h2 id="how-heading" className={`mt-4 ${h2}`}>
                Five steps. You&rsquo;re in control.
              </h2>

              <ol className="relative mt-8 hidden lg:block">
                <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-line" />
                <motion.span
                  aria-hidden="true"
                  style={{ scaleY: still ? 1 : scrollYProgress }}
                  className="absolute bottom-3 left-[15px] top-3 w-px origin-top bg-green"
                />
                {steps.map((step, index) => {
                  const isActive = index === active
                  return (
                    <li key={step.title}>
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-current={isActive ? "step" : undefined}
                        className={`group flex w-full gap-5 rounded-input py-2.5 text-left ${focusRing}`}
                      >
                        <span
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-300 ${
                            isActive
                              ? "bg-green text-white"
                              : "bg-canvas text-ink/40 ring-1 ring-line group-hover:text-ink"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="pt-1">
                          <span
                            className={`block text-[17px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                              isActive ? "text-ink" : "text-ink/40 group-hover:text-ink/70"
                            }`}
                          >
                            {step.title}
                          </span>
                          <span
                            className={`mt-1 block max-w-sm text-[14px] leading-relaxed transition-colors duration-300 ${
                              isActive ? "text-ink-soft" : "text-ink/35"
                            }`}
                          >
                            {step.desc}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Phone: base screen plus stacked overlays that fade in as steps advance */}
            <div className="relative mx-auto w-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] -z-10 rounded-full bg-green-soft blur-3xl"
              />
              <div className="mx-auto w-[min(190px,calc((100svh-27rem)/2.11))] lg:w-[min(340px,calc((100svh-12rem)/2.11))]">
                <DeviceFrame src={steps[0].image} alt={steps[active].alt} sizes={phoneSizes}>
                  {steps.slice(1).map((step, offset) => {
                    const index = offset + 1
                    const shown = active >= index
                    return (
                      <motion.div
                        key={step.title}
                        aria-hidden="true"
                        initial={false}
                        animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 18 }}
                        transition={{ duration: 0.55, ease: EASE_OUT }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={step.image}
                          alt=""
                          fill
                          quality={85}
                          sizes={phoneSizes}
                          className="object-cover object-top"
                          draggable={false}
                        />
                      </motion.div>
                    )
                  })}
                </DeviceFrame>
              </div>
            </div>

            {/* Compact copy for small screens: the active step crossfades, dots jump between steps */}
            <div className="lg:hidden">
              <div className="relative min-h-[7.5rem]">
                {steps.map((step, index) => {
                  const isActive = index === active
                  return (
                    <motion.div
                      key={step.title}
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                      aria-hidden={!isActive}
                      className={`absolute inset-0 ${isActive ? "" : "pointer-events-none"}`}
                    >
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-green">
                        Step {index + 1} of {steps.length}
                      </p>
                      <h3 className="mt-2 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
              <div className="mt-2 flex items-center gap-1">
                {steps.map((step, index) => (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Go to step ${index + 1}: ${step.title}`}
                    aria-current={index === active ? "step" : undefined}
                    className={`flex h-11 w-9 items-center justify-center rounded-full ${focusRing}`}
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        index === active ? "w-6 bg-green" : "w-1.5 bg-ink/20"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
