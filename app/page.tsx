"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate, useInView } from "framer-motion"
import Image from "next/image"
import { Menu, X, ArrowRight, CheckCircle2, Mail, MessageSquare, Target, CalendarCheck, ShieldCheck, Users } from "lucide-react"
import WorkspaceSection from "@/components/workspace-section"
import FAQSection from "@/components/faq-section"
import PricingSection from "@/components/pricing-section"
import CTASection from "@/components/cta-section"
import FooterSection from "@/components/footer-section"
import StatsSection from "@/components/stats-section"
import TiltCard from "@/components/tilt-card"
import JsonLd from "@/components/json-ld"
import DownloadLink from "@/components/download-link"
import TrackedLink from "@/components/tracked-link"

const subtitles = [
  "Build a D3-focused college list from your PRs and grades.",
  "Send personal coach outreach from your own inbox.",
  "Keep coach replies and follow-up history together.",
  "Request beta access and start when invited.",
]

const steps = [
  { num: "1", title: "Build your athlete profile", desc: "Talk through your marks, academics, and preferences with Riley, then review the profile details.", image: "/match.png" },
  { num: "2", title: "Review OneScore matches", desc: "Compare D3 programs using your marks, academics, and college preferences.", image: "/app-explore.png" },
  { num: "3", title: "Send outreach emails", desc: "Generate personalized emails and send them from your own inbox.", image: "/proof-email.png" },
  { num: "4", title: "Track coach replies", desc: "See who replied, manage threads, and plan the next follow-up from your outreach history.", image: "/app-track-replies.png" },
  { num: "5", title: "Keep improving", desc: "Use reply history and follow-up reminders to make your next move clearer.", image: "/proof-engagement.png" },
]

const problems = [
  { p: "You\u2019re guessing which schools are realistic", s: "OneScore helps you compare fit across the current D3 beta dataset." },
  { p: "Your outreach is scattered across drafts and inboxes", s: "Emails go from your own inbox, while OneCommit helps you keep the process organized." },
  { p: "You shouldn\u2019t need a large upfront package", s: "OneCommit starts with a free beta invitation when capacity and a supported app-access path are available." },
  { p: "Waiting on coaches to notice you isn\u2019t a strategy", s: "You choose who to contact and review every message before it sends." },
]

const features = [
  { title: "Riley-guided voice onboarding", desc: "Use Riley's voice conversation to capture marks, academics, and college preferences, then review the profile details.", img: "/proof-dashboard.png" },
  { title: "SmartAdd + Search", desc: "Search the current D3 beta dataset and save schools to your working list.", img: "/app-smart-add.png" },
  { title: "Outreach Dashboard", desc: "Draft emails and organize connected recruiting messages and replies by school.", img: "/proof-engagement.png" },
  { title: "Reply Tracking", desc: "See match details, communication history, and reply status for each saved school.", img: "/track.png" },
]

const heroProofs = [
  { icon: Target, label: "D3-focused OneScore", detail: "School-by-school fit guidance from beta data" },
  { icon: Mail, label: "Own-inbox outreach", detail: "Gmail and Outlook messages from you" },
  { icon: MessageSquare, label: "Reply tracking", detail: "See sent and received activity by school" },
  { icon: CalendarCheck, label: "Free beta invitations", detail: "Request access and start when an invitation is available" },
]

const productHighlights = [
  "OneScore by school",
  "Coach email workflow",
  "Reply status at a glance",
]

const trustItems = [
  {
    icon: Mail,
    title: "Coach outreach stays from you",
    body: "Emails send from the athlete's connected Gmail or Outlook account, so coaches see a real student-athlete message and replies return to that inbox.",
  },
  {
    icon: ShieldCheck,
    title: "No fake coach marketplace",
    body: "OneCommit helps identify programs and prepare outreach. It does not claim coach endorsements, guaranteed interest, or admissions outcomes.",
  },
  {
    icon: CheckCircle2,
    title: "Release safeguards",
    body: "The app release path includes age-gate checks, privacy-first profile handling, and direct support for access or account questions.",
  },
]

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const heroChild = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const } },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const viewportOnce = { once: true, margin: "-80px" as const }

const wordStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const wordChild = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const } },
}

const heroChildBlur = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const } },
}

/* ── Animated underline on key words ── */
function UnderlineText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const, delay }}
        style={{ originX: 0 }}
        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#4ade80] rounded-full pointer-events-none"
      />
    </span>
  )
}

/* ── Section divider ── */
function SectionDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: "easeOut" as const }}
      className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-14"
      style={{ originX: 0.5 }}
    />
  )
}

function TrustSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="px-4 pb-14 flex justify-center"
    >
      <div className="w-full max-w-4xl rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          <div>
            <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">Trust</span>
            <h2 className="mt-2 text-white text-xl sm:text-2xl font-bold tracking-tight">
              Built for legitimate athlete-led outreach.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {trustItems.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg border border-white/[0.07] bg-[#0f1a14]/40 p-4">
                <Icon size={17} className="text-[#86efac]" />
                <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/45">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

/* ── Magnetic wrapper ── */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 14 })
  const springY = useSpring(y, { stiffness: 180, damping: 14 })

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.28)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  )
}

/* ── Above-the-fold product proof ── */
function HeroProductPreview() {
  return (
    <motion.div
      variants={heroChildBlur}
      className="mt-9 w-full max-w-5xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 items-stretch">
        <div className="relative min-h-[280px] sm:min-h-[360px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#13231a] shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
          <Image
            src="/proof-dashboard.png"
            alt="OneCommit athlete dashboard showing recruiting profile details"
            width={932}
            height={1786}
            priority
            className="absolute left-1/2 top-8 w-[56%] max-w-[310px] -translate-x-[72%] rounded-[1.6rem] border border-white/[0.10] shadow-2xl"
            sizes="(max-width: 1024px) 55vw, 310px"
          />
          <Image
            src="/app-explore.png"
            alt="OneCommit matched school explorer"
            width={932}
            height={1786}
            priority
            className="absolute left-1/2 top-4 w-[58%] max-w-[330px] -translate-x-[10%] rounded-[1.6rem] border border-white/[0.10] shadow-2xl"
            sizes="(max-width: 1024px) 58vw, 330px"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-left bg-gradient-to-t from-[#0f1a14] via-[#0f1a14]/90 to-transparent">
            <div className="flex flex-wrap gap-2">
              {productHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/70"
                >
                  <CheckCircle2 size={12} className="text-[#86efac]" />
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {heroProofs.map(({ icon: Icon, label, detail }, i) => (
            <motion.div
              key={label}
              variants={fadeUpItem}
              className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-left"
              whileHover={{ y: -3, borderColor: "rgba(134,239,172,0.24)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                    i === 1
                      ? "border-sky-300/20 bg-sky-300/10 text-sky-200"
                      : i === 3
                        ? "border-amber-300/20 bg-amber-300/10 text-amber-200"
                        : "border-[#4ade80]/20 bg-[#4ade80]/10 text-[#86efac]"
                  }`}
                >
                  <Icon size={17} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <p className="mt-1 text-xs leading-relaxed text-white/40">{detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Feature card with tilt + image parallax ── */
function FeatureCard({ feat, wide = false }: { feat: typeof features[0]; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useTransform(my, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-5, 5])
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 22 })
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 22 })

  const imgX = useTransform(mx, [-0.5, 0.5], [8, -8])
  const imgY = useTransform(my, [-0.5, 0.5], [8, -8])
  const glowX = useTransform(mx, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(my, [-0.5, 0.5], [0, 100])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(74,222,128,0.09) 0%, transparent 60%)`

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onMouseLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      variants={fadeUpItem}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 1000 }}
      className={`bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden relative h-full ${wide ? "flex flex-col md:flex-row" : "flex flex-col"}`}
    >
      <motion.div style={{ background: glowBg }} className="absolute inset-0 z-10 pointer-events-none rounded-xl" />
      <div className={`p-5 pb-3 relative z-20 ${wide ? "md:w-[38%] md:pb-5 md:flex md:flex-col md:justify-center md:flex-shrink-0" : ""}`}>
        <h3 className="text-white text-base font-semibold mb-1">{feat.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
      </div>
      <div className={`flex-1 flex items-end relative z-20 overflow-hidden ${wide ? "px-0 pb-0 md:items-stretch" : "px-4 pb-4"}`}>
        <div className={`w-full overflow-hidden bg-[#f5f5f5] border border-white/[0.08] shadow-lg ${wide ? "rounded-xl md:rounded-none md:rounded-r-xl md:h-full" : "rounded-xl"}`}>
          <motion.div style={{ x: imgX, y: imgY }} className={wide ? "h-full" : ""}>
            <Image
              src={feat.img}
              alt={feat.title}
              width={932}
              height={1786}
              className={`w-full block ${wide ? "h-auto md:h-full md:object-cover md:object-left-top" : "h-auto"}`}
              sizes="(max-width: 768px) 100vw, 440px"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <>
      <JsonLd />
      <LandingPageContent />
    </>
  )
}

function LandingPageContent() {
  const [activeStep, setActiveStep] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const reduceStepMotion = prefersReducedMotion

  /* ── scroll progress ── */
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  /* ── cursor spotlight ── */
  const cursorX = useMotionValue(-1000)
  const cursorY = useMotionValue(-1000)
  const spotlightBg = useMotionTemplate`radial-gradient(circle 600px at ${cursorX}px ${cursorY}px, rgba(74,222,128,0.04), transparent 80%)`

  /* ── typewriter state ── */
  const [typeIndex, setTypeIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setPrefersReducedMotion(media.matches)

    updatePreference()
    media.addEventListener("change", updatePreference)
    return () => media.removeEventListener("change", updatePreference)
  }, [])

  /* ── sticky CTA on scroll ── */
  useEffect(() => {
    const handleScroll = () => setShowStickyCTA(window.scrollY > 600)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ── active section observer ── */
  useEffect(() => {
    if (!mounted) return
    const ids = ["features", "how-it-works", "pricing"]
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [mounted])

  /* ── typewriter effect ── */
  useEffect(() => {
    if (!mounted) return
    const current = subtitles[typeIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1))
        }, 45)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length - 1))
        }, 25)
      } else {
        setIsDeleting(false)
        setTypeIndex((prev) => (prev + 1) % subtitles.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [mounted, displayText, isDeleting, typeIndex])

  useEffect(() => {
    if (!mounted || reduceStepMotion) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
      setAnimKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [mounted, reduceStepMotion])

  const handleStepClick = useCallback((i: number) => {
    setActiveStep(i)
    setAnimKey((prev) => prev + 1)
  }, [])

  return (
    <div
      className="w-full min-h-screen bg-[#0f1a14] relative"
      onMouseMove={(e) => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
      }}
    >
      {/* Cursor spotlight */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: spotlightBg }}
      />

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#4ade80] z-[60] pointer-events-none"
      />

      {/* Hero background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 hero-dot-grid opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(74,222,128,0.06),transparent_32%,rgba(125,211,252,0.04)_72%,transparent)]" />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center px-4 pt-4"
      >
        <div className="w-full max-w-2xl h-11 px-4 pr-2 bg-[#0f1a14]/80 backdrop-blur-xl border border-white/[0.08] rounded-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="OneCommit logo" width={24} height={24} className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
            <div className="pl-4 hidden sm:flex gap-4">
              {[
                { label: "Demo", href: "/demo", id: "" },
                { label: "Coaches", href: "/coaches", id: "" },
                { label: "Features", href: "#features", id: "features" },
                { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
                { label: "Pricing", href: "#pricing", id: "pricing" },
              ].map(({ label, href, id }) => (
                <motion.a
                  key={label}
                  href={href}
                  className={`relative text-xs font-medium transition-colors ${
                    activeSection === id && id ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                  whileHover="hover"
                  initial="rest"
                >
                  {label}
                  <motion.span
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-[#4ade80]"
                  />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex sm:hidden w-8 h-8 items-center justify-center text-white/50 hover:text-white/80 transition-colors"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <Magnetic>
              <DownloadLink
                analyticsSource="home_nav"
                className="h-7 px-4 bg-white text-[#0f1a14] text-xs font-semibold rounded-full flex items-center hover:bg-white/90 transition-colors"
              >
                Download App
              </DownloadLink>
            </Magnetic>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              id="mobile-navigation"
              className="w-full max-w-2xl mt-2 bg-[#0f1a14]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden sm:hidden"
            >
              <div className="py-2 flex flex-col">
                {[
                  { label: "Demo", href: "/demo" },
                  { label: "Coaches", href: "/coaches" },
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-5 py-3 text-white/60 text-sm font-medium hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero */}
      <motion.section
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="pt-28 sm:pt-32 pb-8 px-4 flex flex-col items-center text-center relative z-10"
      >
        {/* Badge with live pulse dot + gradient text */}
        <motion.div variants={heroChild} className="px-3 py-1 mb-5 bg-white/[0.06] border border-white/[0.08] rounded-full flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0"
          />
          <span className="text-gradient-sweep text-xs font-medium">{"D3 Track & Field Beta \u2014 Invitations Limited"}</span>
        </motion.div>

        <motion.h1
          aria-label="Personalized track recruiting without the guesswork"
          variants={wordStagger}
          className="text-white text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight max-w-3xl text-balance"
        >
          {["Personalized", "track", "recruiting"].map((word, i) => (
            <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
              {word}{" "}
            </motion.span>
          ))}
          <motion.span
            animate={{
              textShadow: [
                "0 0 0px rgba(74,222,128,0)",
                "0 0 30px rgba(74,222,128,0.7), 0 0 60px rgba(74,222,128,0.2)",
                "0 0 0px rgba(74,222,128,0)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="text-[#4ade80]"
          >
            {["without", "the", "guesswork"].map((word, i) => (
              <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                {word}{" "}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div variants={heroChild} className="mt-3 flex min-h-10 items-center justify-center px-2">
          <span className="max-w-[34rem] text-balance text-sm font-medium leading-relaxed text-white/60 sm:text-base">
            {displayText}
            <span className="inline-block w-[2px] h-[14px] bg-[#4ade80]/70 ml-0.5 align-middle animate-pulse" />
          </span>
        </motion.div>

        <motion.p variants={heroChildBlur} className="mt-2 text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed font-medium text-pretty">
          {"OneCommit turns your times, marks, GPA, and college preferences into a recruiting workspace: D3-focused OneScore matches, personal coach emails, reply tracking, and follow-up planning in one app."}
        </motion.p>

        <motion.div variants={heroChild} className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full justify-center">
          <Magnetic>
            <DownloadLink
              analyticsSource="home_hero"
              className="h-11 px-7 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors relative overflow-hidden group whitespace-nowrap"
            >
              <span className="relative z-10">Download the App</span>
              <ArrowRight size={14} className="relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="absolute inset-0 animate-shimmer" />
            </DownloadLink>
          </Magnetic>
          <Magnetic>
            <TrackedLink
              href="/demo"
              eventName="demo_click"
              eventSource="home_hero"
              className="h-11 px-6 border border-white/15 text-white text-sm font-medium rounded-full flex items-center hover:bg-white/[0.04] transition-colors whitespace-nowrap"
            >
              Watch the 1-minute demo
            </TrackedLink>
          </Magnetic>
        </motion.div>

        <HeroProductPreview />
      </motion.section>

      {/* Video */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.6 }}
        className="px-4 pb-8 pt-4 flex flex-col items-center"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 40px rgba(74,222,128,0.04)",
              "0 0 80px rgba(74,222,128,0.10)",
              "0 0 40px rgba(74,222,128,0.04)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-3xl rounded-2xl overflow-hidden border border-white/[0.08] bg-black/20 relative group"
        >
          <video
            muted
            playsInline
            controls
            poster="/demo-poster.png"
            preload="none"
            aria-label="OneCommit product demo preview"
            className="w-full aspect-square object-cover block bg-[#101714]"
          >
            <source src="/demo.mp4" type="video/mp4" />
            <track src="/demo.vtt" kind="captions" label="English" default />
          </video>
        </motion.div>
        <TrackedLink
          href="/demo"
          eventName="demo_click"
          eventSource="home_video"
          className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-full text-white/60 text-xs font-medium hover:text-white hover:bg-white/[0.07] transition-all whitespace-nowrap"
        >
          <div className="relative flex-shrink-0 w-3 h-3 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#4ade80]/50"
            />
            <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" className="relative z-10"><path d="M0 0l8 5-8 5V0z"/></svg>
          </div>
          Watch full demo
        </TrackedLink>
      </motion.section>

      {/* Problem + Solution */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="px-4 pb-14 flex justify-center"
      >
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">The Problem</span>
            <motion.h2
              variants={wordStagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance"
            >
              {["The", "recruiting", "system", "isn\u2019t", "built", "for"].map((word, i) => (
                <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
              <motion.span variants={wordChild} className="inline-block">
                <UnderlineText delay={0.4}>you</UnderlineText>
              </motion.span>
            </motion.h2>
            <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">{"Unless you\u2019re a blue-chip recruit, you\u2019re on your own. We\u2019re changing that."}</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {problems.map((item, i) => (
              <TiltCard key={i} className="rounded-xl">
                <motion.div
                  variants={fadeUpItem}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden relative z-20"
                >
                  <div className="px-4 pt-4 pb-3 flex gap-2.5 items-start">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-[10px] font-bold leading-none">✗</span>
                    <p className="text-white/50 text-sm leading-relaxed">{item.p}</p>
                  </div>
                  <div className="mx-4 h-px bg-white/[0.05]" />
                  <div className="px-4 pt-3 pb-4 flex gap-2.5 items-start">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center text-[#4ade80] text-[10px] font-bold leading-none">✓</span>
                    <p className="text-white/70 text-sm leading-relaxed">{item.s}</p>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <SectionDivider />

      {/* Stats */}
      <StatsSection />

      {/* Divider */}
      <SectionDivider />

      {/* Features Bento */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        id="features"
        className="scroll-mt-24 px-4 pb-14 flex justify-center"
      >
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">{"What\u2019s in the Beta"}</span>
            <motion.h2
              variants={wordStagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance"
            >
              {["Everything", "you", "need", "to", "run"].map((word, i) => (
                <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
              <motion.span variants={wordChild} className="inline-block mr-[0.25em]">
                <UnderlineText delay={0.4}>outreach</UnderlineText>
              </motion.span>
            </motion.h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {features.map((feat, i) => (
              <div key={i} className="h-full"><FeatureCard feat={feat} /></div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <SectionDivider />

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        id="how-it-works"
        className="scroll-mt-24 px-4 pb-14 flex justify-center"
      >
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">How It Works</span>
            <motion.h2
              variants={wordStagger}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance"
            >
              {["Five", "steps.", "You\u2019re", "in"].map((word, i) => (
                <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
              <motion.span variants={wordChild} className="inline-block">
                <UnderlineText delay={0.4}>{"control."}</UnderlineText>
              </motion.span>
            </motion.h2>
            <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">{"Create your profile, review D3-focused OneScore matches, send outreach, and track replies from one workspace."}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* Step cards */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="w-full md:w-[380px] flex flex-col gap-2 flex-shrink-0"
            >
              {steps.map((step, i) => {
                const isActive = i === activeStep
                return (
                  <motion.button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    aria-pressed={isActive}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex-1 text-left rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${
                      isActive
                        ? "bg-white/[0.06] border border-white/[0.10]"
                        : "bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08]"
                    }`}
                  >
                    {isActive && (
                      <div className="w-full h-0.5 bg-white/[0.06] overflow-hidden flex-shrink-0">
                        <div
                          key={animKey}
                          className="h-full bg-[#4ade80]"
                          style={reduceStepMotion ? undefined : { animation: "progressBar 5s linear forwards" }}
                        />
                      </div>
                    )}
                    <div className="p-4 flex gap-3 flex-1 items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isActive ? "bg-[#4ade80] text-[#0f1a14]" : "bg-white/[0.06] text-white/40"
                        }`}
                      >
                        <span className="text-xs font-bold">{step.num}</span>
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${isActive ? "text-white" : "text-white/60"}`}>
                          {step.title}
                        </div>
                        <div className={`text-xs mt-0.5 leading-relaxed ${isActive ? "text-white/50" : "text-white/30"}`}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
            {/* Phone preview */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex-1 flex justify-center items-stretch"
            >
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50 || info.velocity.x < -300) {
                    handleStepClick((activeStep + 1) % steps.length)
                  } else if (info.offset.x > 50 || info.velocity.x > 300) {
                    handleStepClick((activeStep - 1 + steps.length) % steps.length)
                  }
                }}
                className="touch-pan-y cursor-grab active:cursor-grabbing w-full max-w-[320px] bg-[#f5f5f5] rounded-[2rem] overflow-hidden border-[3px] border-white/[0.10] shadow-[0_0_60px_rgba(74,222,128,0.06)] relative"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="pointer-events-none"
                  >
                    <Image
                      src={steps[activeStep].image}
                      alt={steps[activeStep].title}
                      width={932}
                      height={1786}
                      sizes="320px"
                      className="h-auto w-full block"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <SectionDivider />

      {/* Founder Story */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="px-4 pb-14 flex justify-center"
      >
        <div className="w-full max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">Our Story</span>
          </div>
          <TiltCard className="rounded-2xl">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8 relative z-20">
              <blockquote className="text-white text-lg sm:text-xl font-medium leading-relaxed tracking-tight">
                {"\u201CIn early 2024, I started reaching out to college track programs. I had the times, the grades, the drive \u2014 but I had no idea which schools actually fit me athletically and academically.\u201D"}
              </blockquote>
              <div className="mt-4 flex flex-col gap-3 text-white/50 text-sm leading-relaxed">
                <p>
                  {"I spent weeks manually Googling coach emails, copy-pasting the same intro letter over and over, and sending messages into the void. Most never got a reply. I had no system for tracking who I\u2019d contacted, what they said, or when to follow up."}
                </p>
                <p>
                  {"So I built one. What started as a quick script to organize my own outreach turned into a matching and email workflow that made the process clearer. I realized the problem wasn\u2019t my ability \u2014 it was the system I was trying to navigate."}
                </p>
                <p>
                  {"The recruiting system is built around the athletes who already have visibility. Everyone else gets left to figure it out alone, or pay for a service that posts a passive profile and waits. OneCommit exists to fix that."}
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4ade80] text-xs font-bold">HK</span>
                </div>
                <div>
                  <div className="text-[#4ade80] text-sm font-semibold">Hugh Kopittke</div>
                  <div className="text-white/40 text-xs">OneCommit Founder &middot; Student-Athlete</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </motion.section>

      <TrustSection />

      {/* Workspace */}
      <WorkspaceSection />

      {/* Coach campaign */}
      <section className="border-y border-white/[0.07] bg-[#17251e] px-4 py-14">
        <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <div className="flex items-center gap-2 text-[#86efac] text-xs font-semibold uppercase">
              <Users size={15} />
              High school coaches
            </div>
            <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl font-bold text-white">
              Give every athlete a recruiting plan without becoming their agent.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
              OneCommit gives track athletes a structured school list, an outreach workspace, and a clear weekly check-in they can own. No coach portal or recruiting-service handoff required.
            </p>
          </div>
          <TrackedLink
            href="/coaches"
            eventName="coach_page_click"
            eventSource="home_coach_band"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0f1a14] transition-colors hover:bg-white/90"
          >
            Coach team rollout
            <ArrowRight size={15} />
          </TrackedLink>
        </div>
      </section>

      {/* Pricing */}
      <div id="pricing" className="scroll-mt-24">
        <PricingSection />
      </div>

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <FooterSection />

      {/* Sticky CTA bar */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-2 pl-4 py-2 bg-[#0f1a14]/90 backdrop-blur-xl border border-white/[0.10] rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            <span className="text-white/50 text-xs font-medium hidden sm:inline">Free, capacity-limited beta</span>
            <Magnetic>
              <DownloadLink
                analyticsSource="home_sticky"
                className="h-8 px-5 bg-white text-[#0f1a14] text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-white/90 transition-colors group"
              >
                Download App
                <ArrowRight size={12} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </DownloadLink>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
