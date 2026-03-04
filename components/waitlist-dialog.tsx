"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { CheckCircle } from "lucide-react"
import { track } from "@vercel/analytics"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import WaitlistForm from "@/components/waitlist-form"

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
