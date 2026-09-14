import { Check, X } from "lucide-react"
import { container, eyebrow, h2, section } from "@/components/home/tokens"
import { Reveal } from "@/components/reveal"
import { h3 } from "@/components/routes/tokens"

export default function PilotBoundaries({
  available,
  unavailable,
}: {
  available: string[]
  unavailable: string[]
}) {
  return (
    <section aria-labelledby="pilot-boundaries-heading" className={section}>
      <div className={container}>
        <Reveal className="max-w-3xl">
          <p className={eyebrow}>Current product boundaries</p>
          <h2 id="pilot-boundaries-heading" className={`mt-4 ${h2}`}>
            Evaluate what athletes can use now—with the limits stated plainly.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <h3 className={h3}>What the athlete workflow includes</h3>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {available.map((item) => (
                <li key={item} className="flex items-start gap-3.5 py-4 text-[16px] leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className={h3}>What is not included</h3>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {unavailable.map((item) => (
                <li key={item} className="flex items-start gap-3.5 py-4 text-[16px] leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-soft text-clay">
                    <X size={14} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
