"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { useMemo } from "react"
import { CheckCircle } from "lucide-react"
import { track } from "@vercel/analytics"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import WaitlistForm from "@/components/waitlist-form"

/* ── confetti particles ── */
function ConfettiBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        color: i % 3 === 0 ? "#4ade80" : i % 3 === 1 ? "#ffffff" : "#86efac",
        x: (Math.random() - 0.5) * 320,
        y: (Math.random() - 0.5) * 280,
        rotate: Math.random() * 720,
        size: Math.random() * 6 + 4,
        delay: Math.random() * 0.15,
      })),
    []
  )
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0, rotate: p.rotate }}
          transition={{ duration: 0.9, ease: "easeOut", delay: p.delay }}
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: "2px",
            position: "absolute",
            top: "50%",
            left: "50%",
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  )
}

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
  const [success, setSuccess] = useState(false)

  const openWaitlist = useCallback(() => {
    setSuccess(false)
    setOpen(true)
    track("waitlist_open", { source: "dialog" })
  }, [])

  const handleOpenChange = (v: boolean) => {
    setOpen(v)
    if (!v) setSuccess(false)
  }

  return (
    <WaitlistContext.Provider value={{ openWaitlist }}>
      {children}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="bg-[#0f1a14] border-white/[0.08] text-white sm:max-w-md"
          showCloseButton
        >
          {success ? (
            /* ── success state ── */
            <div className="relative flex flex-col items-center py-6 text-center overflow-hidden">
              <ConfettiBurst />
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <CheckCircle className="h-14 w-14 text-[#4ade80] mb-4" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="text-2xl font-bold text-white mb-2"
              >
                You&apos;re in.
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.35 }}
                className="text-white/50 text-sm"
              >
                We&apos;ll email you when your wave opens.
              </motion.p>
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

              <WaitlistForm
                layout="modal"
                idPrefix="dlg"
                onSuccess={() => setSuccess(true)}
                showInlineSuccess={false}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </WaitlistContext.Provider>
  )
}
