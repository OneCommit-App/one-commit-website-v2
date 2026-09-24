"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { container, eyebrowDark, h2Dark } from "@/components/home/tokens"
import { EASE_OUT, Reveal, RevealGroup, RevealItem, useStill } from "@/components/reveal"

/**
 * Each card shows a strip cut out of the shipped capture it names, not a phone.
 * At the 260px the device frames rendered at, none of this type was legible, and
 * two of the six phones on the page were repeats of these same two screens. The
 * crops are pre-cut into public/app/ at the size they render — a CSS crop window
 * would ship the whole 2622px capture to show 400px of it.
 *
 * Both strips are 1176x375 so the two cards land on the same height. The Explore
 * crop deliberately stops above "213 programs fit you": the band counts belong to
 * one athlete against one beta dataset, and on a marketing page they would read as
 * a claim about the catalogue.
 */
const features = [
  {
    title: "Riley-guided voice onboarding",
    desc: "A spoken intake instead of a recruiting form. Riley asks, the athlete answers, and every captured detail is editable before anything uses it.",
    image: "/app/riley-take.png",
    alt: "A card in the OneCommit app headed RILEY'S TAKE, naming the athlete's top match on file and suggesting they ask Riley for a first draft this week",
  },
  {
    title: "SmartAdd + Search",
    desc: "Browse, describe what you want, or search by name across the current D3 beta dataset. Saving a school moves it onto the working list.",
    image: "/app/explore-tabs.png",
    alt: "The OneCommit Explore screen's tab row — Explore, SmartAdd and Search — above the line 'Schools ranked against your profile, one at a time.'",
  },
]

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  const still = useStill()

  return (
    <RevealItem className="h-full">
      <motion.article
        whileHover={still ? undefined : { y: -4 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="oc-raised flex h-full flex-col overflow-hidden rounded-card bg-white/[0.05] ring-1 ring-white/[0.08] transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="p-7 sm:p-8">
          <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-white">{feature.title}</h3>
          <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/70">{feature.desc}</p>
        </div>
        {/* Full-bleed to the card edge: the card already clips to rounded-card, so the
            strip picks up the bottom corners. The hairline keeps the light capture
            from fusing with the deep-green card above it. */}
        <div className="mt-auto border-t border-white/10">
          <Image
            src={feature.image}
            alt={feature.alt}
            width={1176}
            height={375}
            sizes="(max-width: 767px) 92vw, (max-width: 1280px) 46vw, 588px"
            className="oc-capture h-auto w-full"
          />
        </div>
      </motion.article>
    </RevealItem>
  )
}

export default function FeatureBand() {
  return (
    <section id="features" className="oc-band scroll-mt-20 bg-shell px-4 py-24 text-white sm:px-6 lg:py-32">
      <div className={container}>
        <Reveal className="max-w-2xl">
          <p className={eyebrowDark}>What&rsquo;s in the beta</p>
          <h2 className={`mt-4 ${h2Dark}`}>Where the work actually starts.</h2>
          <p className="mt-4 text-pretty text-[17px] leading-[1.55] text-white/70 sm:text-[19px]">
            Two things no recruiting form does: a spoken intake, and a search that ranks real programs
            against your own marks.
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
