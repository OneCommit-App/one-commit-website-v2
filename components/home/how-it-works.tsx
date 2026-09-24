"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import DeviceFrame from "@/components/device-frame"
import { eyebrow, focusRing, h2 } from "@/components/home/tokens"
import { EASE_OUT, useStill } from "@/components/reveal"

/**
 * One Tuesday, in order, in the second person. Every fact here is legible in the
 * capture beside it: the Edit details button and the profile chips in profile.png;
 * Reach / Target / Foundation and the "WHY IT SCORES 85" breakdown in explore.png;
 * "4 things to do today.", the 8 MIN review and three 15 MIN prep cards in
 * brief.png; "6 schools saved · nothing sent yet" and "So Riley can send from your
 * address, not ours" in pipeline.png.
 *
 * Nothing here describes an outcome. Narrative present tense makes it very tempting
 * to end on a coach writing back, and no capture shows that, so the tour ends where
 * the evidence does — on the send. The school names stay inside the captures rather
 * than being re-typed into marketing HTML, where they would read as partnerships.
 */
const steps = [
  {
    title: "You talk it through once",
    desc: "You answer out loud instead of filling in a form, then edit anything Riley got wrong before it counts.",
    image: "/app/profile.png",
    alt: "OneCommit profile screen with a 200m mark, GPA and target chips, a Riley's Take card, an Edit details button, and the OneScore readiness meter",
  },
  {
    title: "It shows its arithmetic",
    desc: "Every program lands in Reach, Target or Foundation, with the numbers that put it there underneath.",
    image: "/app/explore.png",
    alt: "OneCommit Explore screen: a program scored 85 out of 100 and banded Target, under a heading reading why it scores 85, listing each mark, the GPA and the SAT against the program's range",
  },
  {
    title: "The next morning, four things",
    desc: "Not a dashboard. Eight minutes to review your top matches, then fifteen each to prep three schools.",
    image: "/app/brief.png",
    alt: "OneCommit's dated Brief, headed with the number of things to do today, each task carrying its own time estimate",
  },
  {
    title: "You send from your own inbox",
    desc: "Nothing goes out until you connect your own email, so every message leaves from your address, not ours.",
    image: "/app/pipeline.png",
    alt: "OneCommit Pipeline screen listing saved schools with nothing sent yet, above a prompt to connect your inbox so mail sends from your address",
  },
]

const phoneSizes = "(max-width: 1024px) 240px, 340px"

/* The fixed nav (components/home/site-nav.tsx, h-14) covers the top 3.5rem of the viewport,
   so the pinned panel starts below it and fills the rest, up to 56rem; each step scrolls for
   the panel centers in the space under the nav, which puts its top exactly at the nav edge
   whenever it fills that space. Per-step scroll travel lives in --oc-step-travel so the one
   value that multiplies by the step count is tunable in one place. */
const navHeight = "3.5rem"
const panelHeight = `min(100svh - ${navHeight}, 56rem)`
const panelTop = `calc(${navHeight} + (100svh - ${navHeight} - ${panelHeight}) / 2)`
const stepTravel = "var(--oc-step-travel)"

/**
 * Sticky scrollytelling: the panel pins for one viewport per step while the phone
 * screen stacks the four screens in order and the matching copy highlights. The
 * later screens are absolutely-positioned layers inside one device frame, not a
 * crossfade between frames, so every layer has to share the device aspect ratio.
 * Reduced motion: nothing pins, scroll position never drives the step, and the
 * steps are plain buttons that swap the screen.
 *
 * Desktop viewports too short for the full copy column step down through the
 * `short` and `shorter` tiers (app/globals.css): tighter spacing and a smaller
 * heading first, then inactive descriptions collapse so the heading, all four
 * steps, and the phone stay inside the pinned panel down to about 490px tall.
 */
export default function HowItWorks() {
  const still = useStill()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] })

  // Scroll only drives the step when the panel actually pins. With reduced motion the
  // wrapper is height:auto, progress reads 1, and this would park the section on step 5.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (still) return
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(progress * steps.length)))
    setActive((current) => (current === next ? current : next))
  })

  // Reduced motion starts on step 1 regardless of where the page loaded.
  useEffect(() => {
    if (still) setActive(0)
  }, [still])

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

  // The tiers only matter while the panel pins; with reduced motion it scrolls normally.
  const tier = still
    ? { panel: "", heading: "", list: "", step: "", collapsed: "" }
    : {
        panel: "lg:short:py-8 lg:shorter:py-6",
        heading: "lg:short:text-[2.25rem] lg:shorter:text-[2rem]",
        list: "lg:short:mt-6 lg:shorter:mt-4",
        step: "lg:short:py-2 lg:shorter:py-1.5",
        collapsed: "lg:shorter:grid-rows-[0fr]",
      }

  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 overflow-x-clip bg-canvas px-4 pb-10 sm:px-6 lg:pb-16">
      {/* Small screens: the heading scrolls away before the panel pins, so the pinned
          panel only has to fit the phone, the step copy, and the dots. */}
      <div className="mx-auto w-full max-w-[1200px] pt-20 lg:hidden">
        <p className={eyebrow}>How it works</p>
        <h2 id="how-heading-compact" className={`mt-4 ${h2}`}>
          From the first conversation to the first send.
        </h2>
      </div>

      <div
        ref={wrapRef}
        style={{ height: still ? "auto" : `calc(${panelHeight} + ${steps.length} * ${stepTravel})` }}
        className="relative mx-auto w-full max-w-[1200px]"
      >
        <div
          style={still ? undefined : { top: panelTop, height: panelHeight }}
          className={
            still
              ? "pb-16 pt-8 lg:py-32"
              : `sticky flex flex-col justify-center pb-6 pt-4 lg:py-16 ${tier.panel}`
          }
        >
          <div className="grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            {/* Large screens: heading plus the step list, pinned beside the phone */}
            <div className="hidden lg:block">
              <p className={eyebrow}>How it works</p>
              <h2 id="how-heading" className={`mt-4 ${h2} ${tier.heading}`}>
                From the first conversation to the first send.
              </h2>

              <ol className={`relative mt-8 ${tier.list}`}>
                <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-line" />
                <motion.span
                  aria-hidden="true"
                  style={{ scaleY: still ? (active + 1) / steps.length : scrollYProgress }}
                  className="absolute bottom-3 left-[15px] top-3 w-px origin-top bg-green"
                />
                {steps.map((step, index) => {
                  const isActive = index === active
                  // Inactive steps dim only while scroll drives them; with reduced motion
                  // every step stays fully readable and the badge marks the current one.
                  const dimmed = !isActive && !still
                  return (
                    <li key={step.title}>
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-current={isActive ? "step" : undefined}
                        className={`group flex w-full gap-5 rounded-input py-2.5 text-left ${tier.step} ${focusRing}`}
                      >
                        <span
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-300 ${
                            isActive
                              ? "bg-green text-on-green"
                              : "bg-canvas text-ink/70 ring-1 ring-line group-hover:text-ink"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="pt-1">
                          <span
                            className={`block text-[17px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                              dimmed ? "text-ink/70 group-hover:text-ink" : "text-ink"
                            }`}
                          >
                            {step.title}
                          </span>
                          {/* Shorter desktop viewports fold inactive descriptions away (1fr -> 0fr). */}
                          <span
                            className={`grid grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out-quint ${
                              dimmed ? tier.collapsed : ""
                            }`}
                          >
                            <span className="min-h-0 overflow-hidden">
                              <span
                                className={`mt-1 block max-w-sm text-[14px] leading-relaxed transition-colors duration-300 ${
                                  dimmed ? "text-ink-soft" : "text-ink/80"
                                }`}
                              >
                                {step.desc}
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Phone: base screen plus stacked overlays that fade in as steps advance.
                Small screens size it from the viewport height (never below 150px) so the
                phone, copy, and dots all fit inside the pinned panel on SE-class devices. */}
            <div className="relative mx-auto w-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] -z-10 rounded-full bg-green-soft blur-3xl"
              />
              <div className="mx-auto w-[clamp(150px,calc((100svh-21rem)/2.11),240px)] lg:w-[min(340px,calc((100svh-12rem)/2.11))]">
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
              <div className="relative min-h-[8.5rem]">
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
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${focusRing}`}
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
