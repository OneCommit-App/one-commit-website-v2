"use client"

import { ArrowRight, CheckCircle2 } from "lucide-react"
import DeviceFrame from "@/components/device-frame"
import DownloadLink from "@/components/download-link"
import { container, h2Dark, pillPrimaryDark, pillSecondaryDark } from "@/components/home/tokens"
import { Reveal } from "@/components/reveal"
import TrackedLink from "@/components/tracked-link"

const included = [
  "Request an invitation, then create a profile",
  "Outlook/Microsoft 365 outreach",
  "Track replies in one workspace",
]

export default function CTASection() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-shell px-4 py-24 text-white sm:px-6 lg:py-32">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]`}>
        <Reveal>
          <h2 id="cta-heading" className={h2Dark}>
            Build your college list. Then run the outreach.
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-[17px] leading-[1.55] text-white/70 sm:text-[19px]">
            Request a OneCommit beta invitation to build a D3-focused OneScore list, draft personal coach emails, and
            track replies from one recruiting workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DownloadLink analyticsSource="home_final_cta" className={`${pillPrimaryDark} group`}>
              Download the App
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
              />
            </DownloadLink>
            <TrackedLink href="/demo" eventName="demo_click" eventSource="home_final_cta" className={pillSecondaryDark}>
              Watch demo
            </TrackedLink>
          </div>
          <ul className="mt-8 flex flex-col gap-2.5">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[15px] text-white/80">
                <CheckCircle2 size={16} aria-hidden="true" className="shrink-0 text-mint" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div className="relative h-[360px] overflow-hidden sm:h-[420px] lg:h-[500px]">
            <div className="absolute left-1/2 top-0 w-[min(300px,80%)] -translate-x-1/2 lg:w-[340px]">
              <DeviceFrame src="/app/welcome.png" alt="OneCommit welcome screen" sizes="(max-width: 1024px) 300px, 340px" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
