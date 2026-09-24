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
import ProblemSection from "@/components/home/problem-section"
import WhereYouStand from "@/components/home/where-you-stand"
import SiteNav from "@/components/home/site-nav"
import { container, eyebrow, focusRing, h2, lede, pillPrimary, pillSecondary, section } from "@/components/home/tokens"
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

/* ── Hero: copy on the left, the real app in a CSS iPhone on the right ── */
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
      className="oc-wash relative overflow-x-clip px-4 pb-16 pt-20 sm:px-6 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <div className={`${container} grid items-center gap-10 sm:gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8`}>
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3.5 py-1.5">
            <motion.span
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.6, 1], opacity: [1, 0.45, 1] }}
              transition={prefersReducedMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-green-mid"
            />
            <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-green">
              Athlete-owned · Track &amp; Field beta
            </span>
          </div>

          {/* Each sentence owns its own line. Left to text-balance the two clauses
              ran together and stranded "Then" alone on line two. The xl 64px step is
              gone because at 64px the second clause needs two lines and the headline
              becomes a three-line rag; at 60px both clauses are exactly one line,
              measured at 1440. */}
          <h1
            aria-label="Find the schools that fit. Then actually email them."
            className="mt-6 text-balance text-[2.625rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.5rem] lg:text-[3.75rem]"
          >
            Find the schools that fit.{" "}
            <span className="block text-green-mid">Then actually email them.</span>
          </h1>

          {/* The first sentence is asserted verbatim against the server HTML by
              scripts/home-ssr.test.mjs, so it stays contiguous. The second is hidden
              below sm — `hidden` is display, not opacity, so the above-the-fold
              opacity assertion still sees it — which lifts the device ~190px on a
              phone, putting the app's next-goal card above the fold. */}
          <p data-home-value-proposition="true" className={`mt-6 max-w-xl ${lede}`}>
            OneCommit scores real programs against your own marks and grades, and shows its work.{" "}
            <span className="hidden sm:inline">
              Then it turns the list into a few things to do today &mdash; written with you, sent from your inbox,
              never ours.
            </span>
          </p>

          <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <DownloadLink analyticsSource="home_hero" className={`${pillPrimary} group w-full sm:w-auto`}>
              Download the App
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
              />
            </DownloadLink>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft">
            <ShieldCheck size={16} aria-hidden="true" className="text-green-mid" />
            Nothing sends without your approval.
          </p>
        </div>

        <div
          data-home-product-proof="true"
          className="relative mx-auto w-full max-w-[420px] lg:max-w-none lg:translate-x-8 xl:translate-x-16"
          style={{ perspective: 1600 }}
        >
          <motion.div
            aria-hidden="true"
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
            transition={prefersReducedMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-x-[-10%] top-[10%] bottom-[10%] -z-10 rounded-full bg-green-soft blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[6%] right-[4%] -z-10 h-44 w-44 rounded-full bg-orange-soft/70 blur-3xl"
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
          <StatsSection items={trustPoints} />
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
