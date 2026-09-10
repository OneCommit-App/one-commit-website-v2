"use client"

import type { LucideIcon } from "lucide-react"
import { CalendarCheck, Mail, Target } from "lucide-react"
import { RevealGroup, RevealItem } from "@/components/reveal"

export type TrustPoint = {
  icon: LucideIcon
  label: string
  detail: string
}

const defaultItems: TrustPoint[] = [
  {
    icon: Target,
    label: "OneScore by school",
    detail: "School-by-school fit guidance from the current D3 beta dataset.",
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

/** Quiet trust strip: three truthful proof points, no counts, no outcomes. */
export default function StatsSection({ items = defaultItems }: { items?: TrustPoint[] }) {
  return (
    <section aria-label="What the beta includes" className="px-4 sm:px-6">
      <RevealGroup
        stagger={0.1}
        className="mx-auto grid w-full max-w-6xl gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-3"
      >
        {items.map(({ icon: Icon, label, detail }) => (
          <RevealItem key={label} y={12} className="flex gap-4 bg-card p-6 sm:p-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div>
              <div className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{label}</div>
              <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{detail}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
