"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import DownloadLink from "@/components/download-link"
import { container, eyebrow, h3Section, lede, pillPrimary, section } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

const plans = [
  {
    name: "Beta",
    eyebrow: "App access",
    description: "Request a free invitation to the core recruiting workspace during beta.",
    price: "Free",
    cadence: "during beta",
    note: "No credit card is required if you receive a beta invitation.",
    cta: "Request Beta Access",
    ctaType: "download",
    features: [
      "D3-focused OneScore matching",
      "Riley-guided voice onboarding",
      "Personalized email generation",
      "Outlook/Microsoft 365 inbox connection",
      "Coach reply tracking",
    ],
  }
]

const oldWay = [
  "Generic public profile",
  "Passive coach discovery",
  "Third-party platform messages",
  "Limited reply visibility",
  "Price disclosed on a call",
]

export default function PricingSection() {
  return (
    <section aria-labelledby="pricing-heading" className={`oc-band-soft ${section} bg-canvas-subtle`}>
      <div className={container}>
        <Reveal className="max-w-2xl">
          <p className={eyebrow}>Beta access</p>
          <h2 id="pricing-heading" className={`mt-4 ${h3Section}`}>
            Free during beta. The price will be shown before anyone is billed.
          </h2>
          <p className={`mt-4 max-w-xl ${lede}`}>
            We are validating the athlete workflow before publishing a price or asking anyone to subscribe.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          {plans.map((plan) => {
            const isBeta = plan.ctaType === "download"
            return (
              <RevealItem
                key={plan.name}
                className={`oc-raised flex h-full flex-col rounded-card bg-card p-7 sm:p-8 ${
                  isBeta ? "shadow-lift ring-1 ring-green/20" : "shadow-soft ring-1 ring-line"
                }`}
              >
                <span
                  className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                    isBeta ? "bg-green-soft text-green" : "bg-orange-soft text-clay"
                  }`}
                >
                  {plan.eyebrow}
                </span>
                <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.01em] text-ink">{plan.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft sm:min-h-16">{plan.description}</p>

                <div className="mt-6">
                  <div className="flex items-end gap-2">
                    <span className="text-[52px] font-bold leading-none tracking-[-0.03em] text-ink">{plan.price}</span>
                    <span className="pb-1 text-[14px] text-ink-soft">{plan.cadence}</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{plan.note}</p>
                </div>

                {isBeta ? (
                  <DownloadLink analyticsSource="pricing_beta" className={`mt-6 ${pillPrimary}`}>
                    {plan.cta}
                  </DownloadLink>
                ) : null}

                <ul className="mt-7 flex flex-col gap-3 border-t border-line pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink">
                      <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-green-mid" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            )
          })}

          <RevealItem className="oc-raised flex h-full flex-col rounded-card bg-mist p-7 ring-1 ring-line sm:p-8">
            <span className="inline-flex w-fit rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
              Old way
            </span>
            <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.01em] text-ink-soft">Legacy recruiting services</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              A passive profile-based model whose price is disclosed on a sales call rather than on the page.
            </p>
            {/* The price slot holds what the market leader actually publishes: nothing.
                No "upfront" qualifier — it described a figure that is no longer claimed. */}
            <div className="mt-6 flex items-end">
              <span className="text-[28px] font-bold leading-none tracking-[-0.02em] text-ink-soft">
                Price on request
              </span>
            </div>
            <p className="mt-auto pt-8 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">Typical legacy model</p>
            <ul className="mt-4 flex flex-col gap-3">
              {oldWay.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
                  <XCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-ink-soft" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  )
}
