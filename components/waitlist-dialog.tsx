"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* ── graduation year options ── */
const graduationYears = [
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
]

/* ── context ── */
type WaitlistContextValue = { openWaitlist: () => void }

const WaitlistContext = createContext<WaitlistContextValue | null>(null)

export function useWaitlist() {
  const ctx = useContext(WaitlistContext)
  if (!ctx) {
    throw new Error("useWaitlist must be used within a <WaitlistProvider>")
  }
  return ctx
}

/* ── provider + dialog ── */
export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    grad_year: "",
    website_guard: "", // honeypot
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const openWaitlist = useCallback(() => {
    setSuccess(false)
    setError("")
    setOpen(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // honeypot check
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
      const message =
        err instanceof Error ? err.message : String(err ?? "")

      if (message.includes("duplicate") || message.includes("unique")) {
        setError("This email is already on the waitlist.")
      } else if (message.includes("JWT") || message.includes("invalid")) {
        setError(
          "Invalid API key. Check your Supabase environment variables."
        )
      } else if (message.includes("RLS") || message.includes("policy")) {
        setError(
          "Database policy blocked the request. Check Supabase RLS settings."
        )
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
    <WaitlistContext.Provider value={{ openWaitlist }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-[#0f1a14] border-white/[0.08] text-white sm:max-w-md"
          showCloseButton
        >
          {success ? (
            /* ── success state ── */
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle className="h-14 w-14 text-[#4ade80] mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                You&apos;re in.
              </h3>
              <p className="text-white/50 text-sm">
                We&apos;ll email you when your wave opens.
              </p>
            </div>
          ) : (
            /* ── form ── */
            <>
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-bold">
                  Join the Beta Waitlist
                </DialogTitle>
                <DialogDescription className="text-white/50 text-sm">
                  Get early access to OneCommit for Track &amp; Field.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                {/* honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
                  <label htmlFor="website_guard">Leave blank</label>
                  <input
                    id="website_guard"
                    type="text"
                    name="website_guard"
                    value={formData.website_guard}
                    onChange={(e) =>
                      setFormData({ ...formData, website_guard: e.target.value })
                    }
                    autoComplete="off"
                  />
                </div>

                {/* first name */}
                <div className="space-y-1.5">
                  <Label htmlFor="waitlist-first_name" className="text-white/70 text-sm">
                    First name <span className="text-[#4ade80]">*</span>
                  </Label>
                  <Input
                    id="waitlist-first_name"
                    type="text"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                  />
                </div>

                {/* last name */}
                <div className="space-y-1.5">
                  <Label htmlFor="waitlist-last_name" className="text-white/70 text-sm">
                    Last name <span className="text-[#4ade80]">*</span>
                  </Label>
                  <Input
                    id="waitlist-last_name"
                    type="text"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                  />
                </div>

                {/* email */}
                <div className="space-y-1.5">
                  <Label htmlFor="waitlist-email" className="text-white/70 text-sm">
                    Email <span className="text-[#4ade80]">*</span>
                  </Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                  />
                </div>

                {/* phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="waitlist-phone" className="text-white/70 text-sm">
                    Phone
                  </Label>
                  <Input
                    id="waitlist-phone"
                    type="tel"
                    placeholder="(optional)"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#4ade80] focus-visible:ring-[#4ade80]/20"
                  />
                </div>

                {/* sport (disabled) */}
                <div className="space-y-1.5">
                  <Label htmlFor="waitlist-sport" className="text-white/70 text-sm">
                    Sport
                  </Label>
                  <Input
                    id="waitlist-sport"
                    value="Track & Field"
                    disabled
                    className="bg-white/[0.02] border-white/[0.06] text-white/40 cursor-not-allowed"
                  />
                </div>

                {/* grad year */}
                <div className="space-y-1.5">
                  <Label htmlFor="waitlist-grad_year" className="text-white/70 text-sm">
                    Grad year
                  </Label>
                  <Select
                    value={formData.grad_year}
                    onValueChange={(v) =>
                      setFormData({ ...formData, grad_year: v })
                    }
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
        </DialogContent>
      </Dialog>
    </WaitlistContext.Provider>
  )
}
