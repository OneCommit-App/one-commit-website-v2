import { container, focusRing } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

/**
 * The product in four words, in the same order as the pinned how-it-works tour.
 * Each line is a shortened form of a claim that section already makes beside a
 * real capture. Nothing here is an outcome.
 */
const beats = [
  {
    n: "01",
    title: "Talk",
    body: "Answer out loud, then edit anything Riley got wrong before it counts.",
  },
  {
    n: "02",
    title: "Score",
    body: "Every program lands in Reach, Target, or Foundation, with the numbers underneath.",
  },
  {
    n: "03",
    title: "Prep",
    body: "The next morning is a short list. Each task carries its own time estimate.",
  },
  {
    n: "04",
    title: "Send",
    body: "Mail leaves from your inbox. Nothing goes out until you approve it.",
  },
]

export default function LoopBand() {
  return (
    <section aria-labelledby="loop-heading" className="px-4 py-20 sm:px-6 lg:py-28">
      <div className={container}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="loop-heading"
              className="max-w-xl text-balance text-[1.75rem] font-bold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2rem]"
            >
              One loop. Finish it before practice.
            </h2>
            <a
              href="#how-it-works"
              className={`inline-flex min-h-11 items-center text-[15px] font-semibold text-green ${focusRing} rounded-full`}
            >
              Walk through a Tuesday
            </a>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-2 xl:grid-cols-4">
          {beats.map((beat) => (
            <RevealItem key={beat.n} className="flex h-full flex-col bg-card p-6 sm:p-7">
              <span className="text-[12px] font-semibold tracking-[0.16em] text-green">{beat.n}</span>
              <p className="mt-4 text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-none tracking-[-0.045em] text-ink">
                {beat.title}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{beat.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
