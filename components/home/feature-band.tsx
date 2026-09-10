"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import DeviceFrame from "@/components/device-frame"
import { container, eyebrowDark, h2Dark } from "@/components/home/tokens"
import { EASE_OUT, Reveal, RevealGroup, RevealItem, useStill } from "@/components/reveal"

const features = [
  {
    title: "Riley-guided voice onboarding",
    desc: "Use Riley's voice conversation to capture marks, academics, and college preferences, then review the profile details.",
    image: "/app/riley.png",
    alt: "OneCommit home screen with Riley's Desk summarizing the athlete's school ranking",
  },
  {
    title: "SmartAdd + Search",
    desc: "Search the current D3 beta dataset and save schools to your working list.",
    image: "/app/explore.png",
    alt: "OneCommit Explore screen with Explore, SmartAdd, and Search tabs and a scored program",
  },
  {
    title: "Outreach Dashboard",
    desc: "Draft emails and organize connected recruiting messages and replies by school.",
    image: "/app/pipeline.png",
    alt: "OneCommit Pipeline screen listing saved schools with email actions",
  },
  {
    title: "Reply Tracking",
    desc: "See match details, communication history, and reply status for each saved school.",
    image: "/app/home.png",
    alt: "OneCommit home screen with the queue of matches, sent messages, and replies",
  },
]

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  const ref = useRef<HTMLElement>(null)
  const still = useStill()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [28, -28])

  return (
    <RevealItem className="h-full">
      <motion.article
        ref={ref}
        whileHover={still ? undefined : { y: -4 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="flex h-full flex-col overflow-hidden rounded-card bg-white/[0.05] ring-1 ring-white/[0.08] transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="p-7 sm:p-8">
          <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-white">{feature.title}</h3>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/70">{feature.desc}</p>
        </div>
        <div className="relative mt-auto h-[320px] overflow-hidden px-8 sm:h-[360px]">
          <motion.div style={still ? undefined : { y }} className="mx-auto w-[min(260px,78%)]">
            <DeviceFrame src={feature.image} alt={feature.alt} sizes="260px" />
          </motion.div>
        </div>
      </motion.article>
    </RevealItem>
  )
}

export default function FeatureBand() {
  return (
    <section id="features" className="scroll-mt-20 bg-shell px-4 py-24 text-white sm:px-6 lg:py-32">
      <div className={container}>
        <Reveal className="max-w-2xl">
          <p className={eyebrowDark}>What&rsquo;s in the beta</p>
          <h2 className={`mt-4 ${h2Dark}`}>Everything you need to run outreach.</h2>
          <p className="mt-4 text-pretty text-[17px] leading-[1.55] text-white/70 sm:text-[19px]">
            Create your profile, review D3-focused OneScore matches, send outreach, and track replies from one
            workspace.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
