import { container, eyebrowDark } from "@/components/home/tokens"
import { Reveal } from "@/components/reveal"

/**
 * One sentence, quoted verbatim off the Building stage of the app's home screen
 * (public/app/home.png): eyebrow BUILDING, headline "Right now, the work is the
 * win.", then the body line set here at lede size.
 *
 * It used to be the smallest type on the page, set at 15px inside a section whose
 * own headline is 42px — a product telling an athlete NOT to do the thing the
 * product is for, buried. The paragraph it was buried in is deleted in the same
 * commit, so the page says this once.
 *
 * Deliberately no screenshot: the same white card carries a hairline, then NEXT
 * GOAL and a large green "Start goal" button. A band that says "no outreach
 * pressure" beside "Start goal" contradicts itself, and the hero already shows the
 * BUILDING card legibly at 440px.
 */
export default function BuildingStage() {
  return (
    <section
      aria-labelledby="building-stage-heading"
      className="oc-band bg-shell px-4 py-28 text-white sm:px-6 sm:py-36"
    >
      <div className={`${container} text-center`}>
        <Reveal>
          <p className={eyebrowDark}>The app at the Building stage</p>
          <h2
            id="building-stage-heading"
            className="mx-auto mt-5 max-w-[46rem] text-balance text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.5rem] lg:text-[2.875rem]"
          >
            Right now, the work is the win.
          </h2>
          <p className="mx-auto mt-6 max-w-[40rem] text-pretty text-[19px] leading-[1.5] text-white/75 sm:text-[21px]">
            No outreach pressure at this stage. Log real races, keep the grades up, and let your trajectory
            tell the story.
          </p>
          <p className="mx-auto mt-8 max-w-[36rem] text-[14px] leading-relaxed text-white/60">
            Quoted verbatim from the Building stage of the app&rsquo;s home screen. It would be easier to sell
            if it said something else.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
