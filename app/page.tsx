"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import { motion, MotionConfig, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, CalendarCheck, Mail, Play, ShieldCheck, Target } from "lucide-react"
import AudienceChooser from "@/components/b2b/audience-chooser"
import CTASection from "@/components/cta-section"
import DeviceFrame from "@/components/device-frame"
import DownloadLink from "@/components/download-link"
import FAQSection from "@/components/faq-section"
import FooterSection from "@/components/footer-section"
import FeatureBand from "@/components/home/feature-band"
import FounderStory from "@/components/home/founder-story"
import HowItWorks from "@/components/home/how-it-works"
import ProblemSection from "@/components/home/problem-section"
import SiteNav from "@/components/home/site-nav"
import { container, eyebrow, focusRing, h2, lede, pillPrimary, pillSecondary, section } from "@/components/home/tokens"
import JsonLd from "@/components/json-ld"
import PricingSection from "@/components/pricing-section"
import { Reveal, useStill } from "@/components/reveal"
import StatsSection from "@/components/stats-section"
import TrackedLink from "@/components/tracked-link"
import WorkspaceSection from "@/components/workspace-section"

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
const heroPhoneWidth = { "--hero-phone-w": "min(340px, calc((100svh - 11rem) / 2.11))" } as React.CSSProperties

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
              Athlete-owned · D3-focused beta
            </span>
          </div>

          <h1
            aria-label="See where your marks stand across Division III track"
            className="mt-6 text-balance text-[2.625rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.5rem] lg:text-[3.75rem] xl:text-[4rem]"
          >
            See where your marks stand across <span className="text-green-mid">Division III</span> track
          </h1>

          {/* The first sentence is asserted verbatim against the server HTML by
              scripts/home-ssr.test.mjs, so it stays contiguous. The second is hidden
              below sm — `hidden` is display, not opacity, so the above-the-fold
              opacity assertion still sees it — which lifts the device ~190px on a
              phone, putting the app's next-goal card above the fold. */}
          <p data-home-value-proposition="true" className={`mt-6 max-w-xl ${lede}`}>
            Turn your marks, grades, and college preferences into a focused list.{" "}
            <span className="hidden sm:inline">
              Draft personal coach outreach from your own inbox, review every message, and keep replies organized in
              one place.
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
            <TrackedLink
              href="/demo"
              eventName="demo_click"
              eventSource="home_hero"
              className={`${pillSecondary} w-full sm:w-auto`}
            >
              Watch the 1-minute demo
            </TrackedLink>
          </div>

          <p className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-ink-soft">
            <ShieldCheck size={16} aria-hidden="true" className="text-green-mid" />
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
                src="/app/home.png"
                alt="OneCommit home screen showing the athlete's next goal, today's tasks, and the queue of matches, sent messages, and replies"
                priority
                sizes="(max-width: 1024px) 280px, 340px"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── One-minute demo in a rounded well with a play affordance ──
   The recording predates the current app screens shown elsewhere on the page, so the
   well stays compact and the caption dates it instead of presenting it as product proof. */
function DemoSection({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  function startPlayback() {
    const video = videoRef.current
    if (!video) return
    const attempt = video.play()
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => undefined)
    }
  }

  return (
    <section aria-labelledby="demo-heading" className={section}>
      <div className={container}>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className={eyebrow}>One-minute demo</p>
          <h2 id="demo-heading" className={`mt-4 ${h2}`}>
            See the whole workflow.
          </h2>
          <p className={`mt-4 ${lede}`}>
            Follow D3-focused OneScore matches, reviewed outreach from a connected inbox, and coach-reply tracking in
            one short walkthrough.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 w-full max-w-[560px]">
          <div className="relative overflow-hidden rounded-hero bg-shell shadow-soft ring-1 ring-ink/10">
            <video
              ref={videoRef}
              muted
              playsInline
              /* Kept unconditional: the custom play button is a React onClick, so with
                 scripting off the native bar is the only way to play the video at all.
                 The two are redundant at rest but they do not overlap — the bar sits at
                 the bottom edge, the button is centred. */
              controls
              poster="/demo-poster.png"
              preload="none"
              aria-label="OneCommit product demo preview"
              onPlay={() => setStarted(true)}
              className="block aspect-square w-full bg-shell object-cover"
            >
              <source src="/demo.mp4" type="video/mp4" />
              <track src="/demo.vtt" kind="captions" label="English" default />
            </video>
            {!started && (
              <button
                type="button"
                onClick={startPlayback}
                aria-label="Play the OneCommit demo video"
                className="group absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <motion.span
                  aria-hidden="true"
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.55], opacity: [0.45, 0] }}
                  transition={prefersReducedMotion ? undefined : { duration: 1.9, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-3 rounded-full bg-white/40"
                />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-green shadow-cta transition-transform duration-300 ease-out-quint group-hover:scale-105">
                  <Play size={22} fill="currentColor" aria-hidden="true" className="ml-0.5" />
                </span>
              </button>
            )}
          </div>
          <p className="mt-4 text-center text-[13px] leading-relaxed text-ink-soft">
            1-minute walkthrough, recorded on an earlier beta build.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-4 text-center">
          <TrackedLink
            href="/demo"
            eventName="demo_click"
            eventSource="home_video"
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-semibold text-green transition-colors hover:text-green-mid ${focusRing}`}
          >
            Open the full demo page
            <ArrowRight size={15} aria-hidden="true" />
          </TrackedLink>
        </Reveal>
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
          <DemoSection prefersReducedMotion={prefersReducedMotion} />
          <ProblemSection />
          <FeatureBand />
          <HowItWorks />
          <WorkspaceSection />
          <FounderStory />
          <AudienceChooser />
          <div id="pricing" className="scroll-mt-20">
            <PricingSection />
          </div>
          <FAQSection />
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
