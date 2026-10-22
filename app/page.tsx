"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import { motion, MotionConfig, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, CalendarCheck, Mail, ShieldCheck, Target } from "lucide-react"
import AudienceChooser from "@/components/b2b/audience-chooser"
import CTASection from "@/components/cta-section"
import DeviceClock from "@/components/device-clock"
import DeviceFrame from "@/components/device-frame"
import DownloadLink from "@/components/download-link"
import FAQSection from "@/components/faq-section"
import FooterSection from "@/components/footer-section"
import BuildingStage from "@/components/home/building-stage"
import DailyLoop from "@/components/home/daily-loop"
import FeatureBand from "@/components/home/feature-band"
import FounderStory from "@/components/home/founder-story"
import HowItWorks from "@/components/home/how-it-works"
import LoopBand from "@/components/home/loop-band"
import ProblemSection from "@/components/home/problem-section"
import TrackField from "@/components/home/track-field"
import WhereYouStand from "@/components/home/where-you-stand"
import SiteNav from "@/components/home/site-nav"
import { container, focusRing, pillPrimaryDark, pillSecondaryDark } from "@/components/home/tokens"
import JsonLd from "@/components/json-ld"
import PricingSection from "@/components/pricing-section"
import { Reveal, useStill } from "@/components/reveal"
import StatsSection from "@/components/stats-section"
import TrackedLink from "@/components/tracked-link"

/* Three truthful proof points shown directly under the hero. No counts, no outcomes. */
const trustPoints = [
  {
    icon: Target,
    label: "OneScore by school",
    detail: "School-by-school fit guidance from the current D3 beta dataset, scored on marks you import from MileSplit.",
  },
  {
    icon: Mail,
    label: "Supported connected inbox",
    detail:
      "Outlook/Microsoft 365 is currently the only inbox option offered in the beta app. Gmail is not currently available.",
  },
  {
    icon: CalendarCheck,
    label: "Free, capacity-limited beta",
    detail: "Request access and start when capacity and a supported app-access path are available.",
  },
]

/* Sized from the viewport height so the whole phone sits above the fold on desktop. */
const heroPhoneWidth = { "--hero-phone-w": "min(440px, calc((100svh - 7rem) / 2.11))" } as React.CSSProperties

export default function LandingPage() {
  return (
    <>
      <JsonLd />
      <LandingPageContent />
    </>
  )
}

/* ── Hero: a night-track poster. Headline spans the panel; the real app sits
      under it, to the right of the offer. Copy stays ahead of the product-proof
      marker in the DOM so the server-HTML contract still holds. ── */
function Hero({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const still = useStill() || prefersReducedMotion

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.5 })
  const y = useTransform(progress, [0, 0.4, 1], [0, -12, -96])
  const scale = useTransform(progress, [0, 0.4, 1], [1, 1, 0.94])
  const rotateY = useTransform(progress, [0, 0.4], [-10, 0])
  const rotateX = useTransform(progress, [0, 0.4], [5, 0])

  return (
    <section
      ref={ref}
      data-home-hero="true"
      style={heroPhoneWidth}
      className="relative overflow-x-clip px-3 pb-6 pt-[4.75rem] sm:px-5 sm:pt-20 lg:px-8 lg:pb-4 lg:pt-24"
    >
      <div className="oc-stadium mx-auto w-full max-w-[1440px] px-5 pb-28 pt-10 sm:px-10 sm:pb-32 sm:pt-14 lg:px-14 lg:pb-40 lg:pt-16">
        <TrackField />
        <div className={`${container} relative grid items-start gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-x-12 lg:gap-y-10`}>
          <div className="flex flex-col items-center text-center lg:col-span-2 lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 ring-1 ring-white/15">
              <motion.span
                animate={prefersReducedMotion ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.45, 1] }}
                transition={prefersReducedMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-mint"
              />
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-mint">
                Athlete-owned · Track &amp; Field beta
              </span>
            </div>

            {/* The headline spans the panel, so it can sit larger than the old
                60px column measure and still keep each clause on its own line.
                The aria-label is the string the server-HTML test requires. */}
            <h1
              aria-label="Find the schools that fit. Then actually email them."
              className="mt-6 text-balance text-[2.75rem] font-bold leading-[0.96] tracking-[-0.045em] text-white sm:text-[4rem] lg:text-[4.75rem] xl:text-[5.25rem]"
            >
              Find the schools that fit.{" "}
              <span className="block text-mint">Then actually email them.</span>
            </h1>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* The first sentence is asserted verbatim against the server HTML by
                scripts/home-ssr.test.mjs, so it stays contiguous. The second is hidden
                below sm — `hidden` is display, not opacity, so the above-the-fold
                opacity assertion still sees it — which lifts the device on a phone. */}
            <p data-home-value-proposition="true" className="max-w-xl text-pretty text-[17px] leading-[1.55] text-[#d7ebe0] sm:text-[19px]">
              OneCommit scores real programs against your own marks and grades, and shows its work.{" "}
              <span className="hidden sm:inline">
                Then it turns the list into a few things to do today &mdash; written with you, sent from your inbox,
                never ours.
              </span>
            </p>

            <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <DownloadLink analyticsSource="home_hero" className={`${pillPrimaryDark} group w-full sm:w-auto`}>
                Download the App
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
                />
              </DownloadLink>
              <a href="#how-it-works" className={`${pillSecondaryDark} w-full sm:w-auto`}>
                See how it works
              </a>
            </div>

            <p className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[#d7ebe0]">
              <ShieldCheck size={16} aria-hidden="true" className="text-mint" />
              Nothing sends without your approval.
            </p>
          </div>

          <div
            data-home-product-proof="true"
            className="relative mx-auto w-full max-w-[420px] lg:max-w-none"
            style={{ perspective: 1600 }}
          >
            <motion.div
              aria-hidden="true"
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
              transition={prefersReducedMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-x-[-6%] top-[12%] bottom-[8%] -z-10 rounded-full bg-[#9cd8b5]/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[4%] left-[8%] -z-10 h-40 w-40 rounded-full bg-[#e89248]/25 blur-3xl"
            />
            <motion.div
              style={still ? undefined : { y, scale, rotateY, rotateX }}
              className="mx-auto w-[min(280px,74vw)] [transform-style:preserve-3d] lg:w-[var(--hero-phone-w)]"
            >
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
                transition={prefersReducedMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <DeviceFrame
                  src="/app/home-hero.png"
                  alt="OneCommit home screen: a greeting, then a card headed BUILDING reading 'Right now, the work is the win — no outreach pressure at this stage', the athlete's next goal, today's tasks, and the queue of matches, sent messages and replies"
                  priority
                  sizes="(max-width: 1024px) 320px, 440px"
                >
                  <DeviceClock />
                </DeviceFrame>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LandingPageContent() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    updatePreference()
    media.addEventListener("change", updatePreference)
    return () => media.removeEventListener("change", updatePreference)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div id="onecommit-home" className="relative min-h-screen w-full bg-canvas text-ink">
        <a
          href="#main-content"
          className={`sr-only fixed left-4 top-4 z-[80] rounded-full bg-green px-4 py-3 text-sm font-semibold text-on-green shadow-cta focus:not-sr-only ${focusRing}`}
        >
          Skip to main content
        </a>

        <SiteNav />

        <main id="main-content" tabIndex={-1}>
          <Hero prefersReducedMotion={prefersReducedMotion} />
          <div className="relative z-10 -mt-16 sm:-mt-20">
            <StatsSection items={trustPoints} />
          </div>
          <LoopBand />
          <ProblemSection />
          <WhereYouStand />
          <FeatureBand />
          <HowItWorks />
          <BuildingStage />
          <DailyLoop />
          <FounderStory />
          <div id="pricing" className="scroll-mt-20">
            <PricingSection />
          </div>
          <FAQSection />
          <AudienceChooser />
          <CTASection />
        </main>

        <FooterSection />

        <noscript>
          <style>{`
            #onecommit-home [style*="opacity:0"],
            #onecommit-home [style*="opacity: 0"] {
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }
            #onecommit-home * {
              animation: none !important;
              transition: none !important;
            }
            @media (max-width: 767px) {
              #onecommit-home [data-mobile-menu-toggle="true"] {
                display: none !important;
              }
              #onecommit-home #mobile-navigation {
                display: block !important;
                opacity: 1 !important;
                transform: none !important;
              }
              #onecommit-home [data-mobile-navigation-links="true"] {
                flex-direction: row !important;
                overflow-x: auto !important;
                overscroll-behavior-x: contain;
                padding: 0.5rem !important;
              }
              #onecommit-home [data-mobile-navigation-links="true"] a {
                align-items: center;
                display: flex;
                flex: 0 0 auto;
                min-height: 44px;
                padding: 0.5rem 0.75rem !important;
              }
              #onecommit-home [data-home-hero="true"] {
                padding-top: 9.5rem !important;
              }
            }
          `}</style>
        </noscript>
      </div>
    </MotionConfig>
  )
}
