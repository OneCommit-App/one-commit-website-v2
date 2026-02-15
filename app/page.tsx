"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TestimonialsSection from "@/components/testimonials-section"
import FAQSection from "@/components/faq-section"
import PricingSection from "@/components/pricing-section"
import CTASection from "@/components/cta-section"
import FooterSection from "@/components/footer-section"

const subtitles = [
  "Build your school list in minutes.",
  "Generate coach emails that sound like you.",
  "Track replies like a recruiting CRM.",
]

const steps = [
  { num: "1", title: "Create your profile", desc: "Add your times, GPA/SAT, and what matters to you in a college experience.", image: "/match.png" },
  { num: "2", title: "Get matched schools", desc: "See Reach, Target & Foundational tiers with match percentage breakdowns.", image: "/app-explore.png" },
  { num: "3", title: "Send outreach emails", desc: "Generate personalized emails and send them from your own inbox.", image: "/proof-email.png" },
  { num: "4", title: "Track coach replies", desc: "See who replied, manage threads, and follow up at the right time.", image: "/app-track-replies.png" },
]

const problems = [
  { p: "You don\u2019t know where you fit", s: "Smart matching shows exactly where you stand across hundreds of programs." },
  { p: "Emails get ghosted", s: "Emails come from YOUR inbox. Coaches see a real person and respond." },
  { p: "Legacy services cost thousands", s: "OneCommit is free during beta and will always be a fraction of the cost." },
  { p: "Profile sites put coaches in control", s: "You control the timeline, strategy, and conversation. No middleman." },
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

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" as const } },
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

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [mounted, setMounted] = useState(false)

  /* ── typewriter state ── */
  const [typeIndex, setTypeIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className="w-full min-h-screen bg-[#0f1a14] overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <div className="w-full max-w-2xl h-11 px-4 pr-2 bg-[#0f1a14]/80 backdrop-blur-xl border border-white/[0.08] rounded-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.ico" alt="OneCommit logo" className="w-6 h-6 rounded-full" />
            <span className="text-white text-sm font-semibold">OneCommit</span>
            <div className="pl-4 hidden sm:flex gap-4">
              <a href="#features" className="text-white/50 text-xs font-medium hover:text-white/80 transition-colors">Features</a>
              <a href="#how-it-works" className="text-white/50 text-xs font-medium hover:text-white/80 transition-colors">How It Works</a>
              <a href="#pricing" className="text-white/50 text-xs font-medium hover:text-white/80 transition-colors">Pricing</a>
            </div>
          </div>
          <a href="https://www.onecommit.us/" target="_blank" rel="noopener noreferrer" className="h-7 px-4 bg-white text-[#0f1a14] text-xs font-semibold rounded-full flex items-center hover:bg-white/90 transition-colors">
            Join Beta
          </a>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="pt-28 sm:pt-32 pb-4 px-4 flex flex-col items-center text-center"
      >
        <motion.div variants={heroChild} className="px-3 py-1 mb-5 bg-white/[0.06] border border-white/[0.08] rounded-full">
          <span className="text-[#4ade80] text-xs font-medium">{"Track & Field Beta \u2014 Free Early Access"}</span>
        </motion.div>

        <motion.h1 variants={heroChild} className="text-white text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight max-w-3xl text-balance">
          {"Get recruited faster "}
          <span className="text-[#4ade80]">{"for Track & Field"}</span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div variants={heroChild} className="h-7 mt-2 flex items-center justify-center">
          <span className="text-white/50 text-sm font-medium whitespace-nowrap">
            {displayText}
            <span className="inline-block w-[2px] h-[14px] bg-[#4ade80]/70 ml-0.5 align-middle animate-pulse" />
          </span>
        </motion.div>

        <motion.p variants={heroChild} className="mt-3 text-white/60 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
          {"OneCommit turns your stats + preferences into matched schools, then helps you send outreach emails and track coach replies."}
        </motion.p>

        <motion.div variants={heroChild} className="flex items-center gap-3 mt-8">
          <a href="https://www.onecommit.us/" target="_blank" rel="noopener noreferrer" className="h-10 px-7 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center hover:bg-white/90 transition-colors">
            Join the Track Beta
          </a>
          <a href="#how-it-works" className="h-10 px-6 border border-white/15 text-white text-sm font-medium rounded-full flex items-center hover:bg-white/[0.04] transition-colors">
            See how it works
          </a>
        </motion.div>
      </motion.section>

      {/* Video */}
      <motion.section
        variants={scaleUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="px-4 pb-8 pt-4 flex justify-center"
      >
        <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-white/[0.08] bg-black/20 shadow-[0_0_80px_rgba(74,222,128,0.06)]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block"
          >
            <source src="/demo.mp4" type="video/mp4" />
          </video>
        </div>
      </motion.section>

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
            <motion.div key={f} variants={popIn} className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-full text-white/70 text-xs font-medium">
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
            <h2 className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
              {"Recruiting is broken for the 99%"}
            </h2>
            <p className="mt-2 text-white/50 text-sm max-w-md mx-auto">{"Unless you\u2019re a blue-chip recruit, the system wasn\u2019t built for you."}</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {problems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl"
              >
                <h3 className="text-white text-sm font-semibold mb-1">{item.p}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.s}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

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
            <h2 className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Everything you need to get recruited
            </h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {features.map((feat, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col"
              >
                <div className="p-5 pb-3">
                  <h3 className="text-white text-base font-semibold mb-1">{feat.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
                </div>
                <div className="px-4 pb-4 flex-1 flex items-end">
                  <div className="w-full rounded-xl overflow-hidden bg-[#f5f5f5] border border-white/[0.08] shadow-lg">
                    <img src={feat.img} alt={feat.title} className="w-full h-auto block" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

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
            <h2 className="mt-2 text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
              {"Four steps. You\u2019re in control."}
            </h2>
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
              <div className="w-full max-w-[320px] bg-[#f5f5f5] rounded-[2rem] overflow-hidden border-[3px] border-white/[0.10] shadow-[0_0_60px_rgba(74,222,128,0.06)] relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeStep}
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full h-auto block"
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Founder Story */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="px-4 pb-14 flex justify-center"
      >
        <div className="w-full max-w-2xl text-center">
          <span className="text-[#4ade80] text-xs font-semibold uppercase tracking-wider">Our Story</span>
          <blockquote className="mt-4 text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed tracking-tight text-balance">
            {"\u201CIn early 2024, I began my journey to becoming a college track athlete. I knew who I was as an athlete and a student, but didn\u2019t know anything about where I could fit.\u201D"}
          </blockquote>
          <p className="mt-3 text-white/50 text-sm leading-relaxed max-w-lg mx-auto">
            {"After finding coach contact emails and writing the same introductory email over and over again, I decided to write some code to do it for me \u2014 thus, OneCommit was born. The recruiting process is broken for anyone not in the top 1%. We\u2019re here to level the playing field."}
          </p>
          <div className="mt-3">
            <div className="text-[#4ade80] text-sm font-semibold">The OneCommit Founder</div>
            <div className="text-white/40 text-xs">Student-Athlete Who Lived the Problem</div>
          </div>
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
    </div>
  )
}
