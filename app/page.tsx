"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate, useInView } from "framer-motion"
import Image from "next/image"
import { Menu, X, ArrowRight } from "lucide-react"
import TestimonialsSection from "@/components/testimonials-section"
import FAQSection from "@/components/faq-section"
import PricingSection from "@/components/pricing-section"
import CTASection from "@/components/cta-section"
import FooterSection from "@/components/footer-section"
import StatsSection from "@/components/stats-section"
import SchoolMarquee from "@/components/school-marquee"
import TiltCard from "@/components/tilt-card"
import { WaitlistProvider, useWaitlist } from "@/components/waitlist-dialog"

const subtitles = [
  "Match to 40+ colleges that fit your times and GPA.",
  "Send outreach emails coaches actually read.",
  "See exactly who replied and who's interested.",
]

const steps = [
  { num: "1", title: "Create your profile", desc: "Add your times, GPA/SAT, and what matters to you in a college experience.", image: "/match.png" },
  { num: "2", title: "Get matched schools", desc: "See Reach, Target & Foundational tiers with match percentage breakdowns.", image: "/app-explore.png" },
  { num: "3", title: "Send outreach emails", desc: "Generate personalized emails and send them from your own inbox.", image: "/proof-email.png" },
  { num: "4", title: "Track coach replies", desc: "See who replied, manage threads, and follow up at the right time.", image: "/app-track-replies.png" },
]

const problems = [
  { p: "You\u2019re guessing which schools are realistic", s: "Smart matching shows exactly where you stand across hundreds of programs." },
  { p: "Your emails disappear into a coach\u2019s inbox", s: "Emails come from YOUR inbox. Coaches see a real person and respond." },
  { p: "You shouldn\u2019t need to pay $3,000 for a spreadsheet", s: "OneCommit is free during beta and will always be a fraction of the cost." },
  { p: "Waiting on coaches to notice you isn\u2019t a strategy", s: "You control the timeline, strategy, and conversation. No middleman." },
]

const features = [
  { title: "Profile Builder", desc: "Height/weight, PRs, GPA/SAT, links, notable results. Everything a coach needs.", img: "/proof-dashboard.png" },
  { title: "SmartAdd + Search", desc: "Type what you want and save matched schools to your dashboard.", img: "/app-smart-add.png" },
  { title: "Outreach Dashboard", desc: "Generate emails, track sent messages & replies, and manage all coach conversations.", img: "/proof-engagement.png" },
  { title: "Reply Tracking", desc: "See match details, communication history, and reply status for every school.", img: "/track.png" },
]

const featurePills = ["Smart Matching", "AI-Powered Outreach", "Engagement Tracking", "SmartAdd Search"]

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
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
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
              width={600}
              height={400}
              className={`w-full block ${wide ? "h-auto md:h-full md:object-cover md:object-left-top" : "h-auto"}`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <WaitlistProvider>
      <LandingPageContent />
    </WaitlistProvider>
  )
}

function LandingPageContent() {
  const { openWaitlist } = useWaitlist()
  const [activeStep, setActiveStep] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  /* ── scroll progress ── */
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  /* ── mouse parallax (blob) ── */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const blobX = useTransform(mouseX, [0, 1440], [-30, 30])
  const blobY = useTransform(mouseY, [0, 900], [-20, 20])

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
    if (!mounted) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
      setAnimKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  const handleStepClick = useCallback((i: number) => {
    setActiveStep(i)
    setAnimKey((prev) => prev + 1)
  }, [])

  return (
    <div
      className="w-full min-h-screen bg-[#0f1a14] relative"
      onMouseMove={(e) => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
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

      {/* Hero background: dot grid + blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 hero-dot-grid" />
        <motion.div
          style={{ x: blobX, y: blobY }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#4ade80] blur-[200px] animate-hero-pulse"
        />
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
            <Image src="/logo.ico" alt="OneCommit logo" width={24} height={24} className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
            <div className="pl-4 hidden sm:flex gap-4">
              {[
                { label: "Demo", href: "/demo", id: "" },
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
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <Magnetic>
              <button onClick={openWaitlist} className="h-7 px-4 bg-white text-[#0f1a14] text-xs font-semibold rounded-full flex items-center hover:bg-white/90 transition-colors">
                Join Free Beta
              </button>
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
              className="w-full max-w-2xl mt-2 bg-[#0f1a14]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden sm:hidden"
            >
              <div className="py-2 flex flex-col">
                {[
                  { label: "Demo", href: "/demo" },
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
        className="pt-28 sm:pt-32 pb-4 px-4 flex flex-col items-center text-center"
      >
        {/* Badge with live pulse dot + gradient text */}
        <motion.div variants={heroChild} className="px-3 py-1 mb-5 bg-white/[0.06] border border-white/[0.08] rounded-full flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.35, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0"
          />
          <span className="text-gradient-sweep text-xs font-medium">{"Track & Field Beta \u2014 Free Early Access"}</span>
        </motion.div>

        <motion.h1
          variants={wordStagger}
          className="text-white text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight max-w-3xl text-balance"
        >
          {["Stop", "waiting", "for", "coaches"].map((word, i) => (
            <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
              {word}
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
            {["to", "find", "you"].map((word, i) => (
              <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                {word}
              </motion.span>
            ))}
          </motion.span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div variants={heroChild} className="h-7 mt-2 flex items-center justify-center">
          <span className="text-white/50 text-sm font-medium whitespace-nowrap">
            {displayText}
            <span className="inline-block w-[2px] h-[14px] bg-[#4ade80]/70 ml-0.5 align-middle animate-pulse" />
          </span>
        </motion.div>

        <motion.p variants={heroChildBlur} className="mt-3 text-white/60 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          {"OneCommit analyzes your PRs, GPA, and preferences to surface matched schools \u2014 then helps you send personalized emails and track every reply. Free during beta."}
        </motion.p>

        <motion.div variants={heroChild} className="flex items-center gap-3 mt-8">
          <Magnetic>
            <button onClick={openWaitlist} className="h-10 px-7 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors relative overflow-hidden group">
              <span className="relative z-10">Get Early Access &mdash; It&apos;s Free</span>
              <ArrowRight size={14} className="relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              <span className="absolute inset-0 animate-shimmer" />
            </button>
          </Magnetic>
          <Magnetic>
            <a href="/demo" className="h-10 px-6 border border-white/15 text-white text-sm font-medium rounded-full flex items-center hover:bg-white/[0.04] transition-colors">
              Watch the 2-min demo
            </a>
          </Magnetic>
        </motion.div>
      </motion.section>

      {/* Video */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.6 }}
        className="px-4 pb-8 pt-4 flex justify-center"
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
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="w-full h-auto block"
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
          <a
            href="/demo"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-2 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-white/60 text-xs font-medium hover:text-white hover:bg-black/70 transition-all whitespace-nowrap"
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
          </a>
        </motion.div>
      </motion.section>

      {/* Floating connector orb */}
      <div className="relative h-px flex justify-center overflow-visible pointer-events-none">
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[#4ade80] blur-[80px] opacity-[0.025] animate-float" style={{ top: "-100px" }} />
      </div>

      {/* School marquee */}
      <SchoolMarquee />

      {/* Quick feature pills */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="px-4 pb-10 flex justify-center"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {featurePills.map((f) => (
            <motion.div key={f} variants={popIn} whileHover={{ borderColor: "rgba(74,222,128,0.5)", boxShadow: "0 0 12px rgba(74,222,128,0.2)" }} className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-full text-white/70 text-xs font-medium transition-shadow">
              {f}
            </motion.div>
          ))}
        </div>
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
        className="px-4 pb-14 flex justify-center"
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
              {["Everything", "you", "need", "to", "get"].map((word, i) => (
                <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
              <motion.span variants={wordChild} className="inline-block mr-[0.25em]">
                <UnderlineText delay={0.4}>recruited</UnderlineText>
              </motion.span>
            </motion.h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="md:col-span-2"><FeatureCard feat={features[0]} wide /></div>
            <div className="md:col-span-1"><FeatureCard feat={features[1]} /></div>
            <div className="md:col-span-1"><FeatureCard feat={features[2]} /></div>
            <div className="md:col-span-2"><FeatureCard feat={features[3]} wide /></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <SectionDivider />

      {/* How It Works - 4 steps */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        id="how-it-works"
        className="px-4 pb-14 flex justify-center"
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
              {["Four", "steps.", "You\u2019re", "in"].map((word, i) => (
                <motion.span key={i} variants={wordChild} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
              <motion.span variants={wordChild} className="inline-block">
                <UnderlineText delay={0.4}>{"control."}</UnderlineText>
              </motion.span>
            </motion.h2>
            <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">{"Create your profile, discover matched schools, send outreach, and track replies."}</p>
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
                          style={{ animation: "progressBar 5s linear forwards" }}
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
                  <motion.img
                    key={activeStep}
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-auto block pointer-events-none"
                  />
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
        <div className="w-full max-w-2xl">
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
                  {"So I built one. What started as a quick script to automate my own outreach turned into a full matching and email system. Within weeks, coaches were actually writing back. I realized the problem wasn\u2019t my ability \u2014 it was the process."}
                </p>
                <p>
                  {"The recruiting system is designed for the top 1%. Everyone else gets left to figure it out alone, or pay thousands for a service that posts a passive profile and waits. OneCommit exists to fix that."}
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

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing */}
      <div id="pricing">
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
            <span className="text-white/50 text-xs font-medium hidden sm:inline">Free during beta</span>
            <Magnetic>
              <button
                onClick={openWaitlist}
                className="h-8 px-5 bg-white text-[#0f1a14] text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-white/90 transition-colors group"
              >
                Get Early Access
                <ArrowRight size={12} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
