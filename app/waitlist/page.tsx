"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const graduationYears = ["2025", "2026", "2027", "2028", "2029", "2030", "2031"]

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    grad_year: "",
    website_guard: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.website_guard) return

    setSubmitting(true)
    setError("")

    try {
      const payload = {
        first_name: (formData.first_name || "").trim(),
        last_name: (formData.last_name || "").trim(),
        email: (formData.email || "").trim().toLowerCase(),
        sport: "Track & Field",
        grad_year: String(formData.grad_year || ""),
        state: null,
        phone: (formData.phone || "").trim() || null,
      }

      const { error: insertError } = await supabase
        .from("waitlist")
        .insert([payload])

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        grad_year: "",
        website_guard: "",
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err ?? "")

      if (message.includes("duplicate") || message.includes("unique")) {
        setError("This email is already on the waitlist.")
      } else if (message.includes("JWT") || message.includes("invalid")) {
        setError("Invalid API key. Check your Supabase environment variables.")
      } else if (message.includes("RLS") || message.includes("policy")) {
        setError("Database policy blocked the request. Check Supabase RLS settings.")
      } else if (message) {
        setError(`Something went wrong: ${message}`)
      } else {
        setError("Something went wrong — please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1a14] flex flex-col items-center justify-center px-4 py-12">
      {/* Logo + nav back */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
        className="mb-8"
      >
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.ico" alt="OneCommit logo" className="w-7 h-7 rounded-full" />
          <span className="text-white text-base font-semibold">OneCommit</span>
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.1 }}
        className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8"
      >
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <CheckCircle className="h-14 w-14 text-[#4ade80] mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">You&apos;re in.</h2>
            <p className="text-white/50 text-sm mb-6">We&apos;ll email you when your wave opens.</p>
            <Link
              href="/"
              className="h-10 px-6 bg-white/[0.06] border border-white/[0.08] text-white text-sm font-medium rounded-full inline-flex items-center hover:bg-white/[0.10] transition-colors"
            >
              Back to homepage
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-block px-3 py-1 mb-4 bg-white/[0.06] border border-white/[0.08] rounded-full">
                <span className="text-[#4ade80] text-xs font-medium">Track &amp; Field Beta</span>
              </div>
              <h1 className="text-white text-2xl font-bold tracking-tight">Join the Beta Waitlist</h1>
              <p className="mt-2 text-white/50 text-sm">Get early access to OneCommit for Track &amp; Field.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
                <label htmlFor="wl_website_guard">Leave blank</label>
                <input
                  id="wl_website_guard"
                  type="text"
                  name="website_guard"
                  value={formData.website_guard}
                  onChange={(e) => setFormData({ ...formData, website_guard: e.target.value })}
                  autoComplete="off"
                />
              </div>

              {/* name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="wl-first_name" className="text-white/70 text-sm">
                    First name <span className="text-[#4ade80]">*</span>
                  </Label>
                  <Input
                    id="wl-first_name"
                    type="text"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wl-last_name" className="text-white/70 text-sm">
                    Last name <span className="text-[#4ade80]">*</span>
                  </Label>
                  <Input
                    id="wl-last_name"
                    type="text"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                  />
                </div>
              </div>

              {/* email */}
              <div className="space-y-1.5">
                <Label htmlFor="wl-email" className="text-white/70 text-sm">
                  Email <span className="text-[#4ade80]">*</span>
                </Label>
                <Input
                  id="wl-email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                />
              </div>

              {/* phone */}
              <div className="space-y-1.5">
                <Label htmlFor="wl-phone" className="text-white/70 text-sm">Phone</Label>
                <Input
                  id="wl-phone"
                  type="tel"
                  placeholder="(optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                />
              </div>

              {/* sport (disabled) */}
              <div className="space-y-1.5">
                <Label htmlFor="wl-sport" className="text-white/70 text-sm">Sport</Label>
                <Input
                  id="wl-sport"
                  value="Track & Field"
                  disabled
                  className="bg-white/[0.02] border-white/[0.06] text-white/40 cursor-not-allowed"
                />
              </div>

              {/* grad year */}
              <div className="space-y-1.5">
                <Label htmlFor="wl-grad_year" className="text-white/70 text-sm">Grad year</Label>
                <Select
                  value={formData.grad_year}
                  onValueChange={(v) => setFormData({ ...formData, grad_year: v })}
                >
                  <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] text-white data-[placeholder]:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20">
                    <SelectValue placeholder="Select grade / grad year" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#162a1e] border-white/[0.08]">
                    {graduationYears.map((y) => (
                      <SelectItem
                        key={y}
                        value={y}
                        className="text-white/80 focus:bg-white/[0.06] focus:text-white"
                      >
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-10 bg-white text-[#0f1a14] text-sm font-semibold rounded-full flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Joining..." : "Join Beta Waitlist"}
              </button>
            </form>
          </>
        )}
      </motion.div>

      {/* Back link */}
      {!success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5"
        >
          <Link href="/" className="text-white/40 text-xs hover:text-white/60 transition-colors">
            &larr; Back to homepage
          </Link>
        </motion.div>
      )}
    </div>
  )
}
