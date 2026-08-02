import { CheckCircle2, ShieldCheck } from "lucide-react"

export default function PilotBoundaries({
  available,
  unavailable,
}: {
  available: string[]
  unavailable: string[]
}) {
  return (
    <section aria-labelledby="pilot-boundaries-heading" className="bg-white px-4 py-16 text-[#15231d] sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#235d48]">Current product boundaries</p>
        <h2 id="pilot-boundaries-heading" className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Evaluate what athletes can use now—with the limits stated plainly.
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold">What the athlete workflow includes</h3>
            <ul className="mt-6 grid gap-4 text-sm text-[#15231d]/75">
              {available.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#235d48]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[#15231d]/15 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <h3 className="text-xl font-bold">What is not included</h3>
            <ul className="mt-6 grid gap-4 text-sm text-[#15231d]/75">
              {unavailable.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#235d48]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
