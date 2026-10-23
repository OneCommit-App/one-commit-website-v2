import { container, focusRing } from "@/components/home/tokens"
import { Reveal } from "@/components/reveal"

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
    <section aria-labelledby="loop-heading" className="overflow-x-clip px-4 py-20 sm:px-6 lg:py-28">
      <div className={container}>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="loop-heading"
              className="max-w-xl text-balance text-[1.75rem] font-bold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.25rem]"
            >
              One loop. Finish it before practice.
            </h2>
            <a
              href="#how-it-works"
              className={`inline-flex min-h-11 items-center rounded-full text-[15px] font-semibold text-green ${focusRing}`}
            >
              Walk through a Tuesday
            </a>
          </div>
        </Reveal>

        <ol className="relative mt-14 grid gap-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-line lg:block" />
          {beats.map((beat) => (
            <li key={beat.n} className="relative">
              <span className="relative z-10 inline-flex h-14 min-w-14 items-center justify-center rounded-full bg-green px-3 text-[13px] font-bold tracking-[0.08em] text-on-green ring-8 ring-canvas">
                {beat.n}
              </span>
              <p className="mt-6 text-[clamp(3rem,6vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-ink">
                {beat.title}
              </p>
              <p className="mt-4 max-w-[18rem] text-[15px] leading-relaxed text-ink-soft">{beat.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
