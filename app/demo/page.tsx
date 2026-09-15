import { ArrowRight, Captions } from "lucide-react"
import DownloadLink from "@/components/download-link"
import FooterSection from "@/components/footer-section"
import { container, eyebrow, eyebrowDark, h2, lede, pillPrimary, pillPrimaryDark, section } from "@/components/home/tokens"
import PublicHeader from "@/components/public-header"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"
import RouteShell from "@/components/routes/route-shell"
import { h1Dark, ledeDark } from "@/components/routes/tokens"

/* What the recording shows, in order, taken from its caption track (public/demo.vtt). */
const chapters = [
  { at: "0:00", title: "Athlete profile", detail: "Creating an athlete profile with times, GPA, and preferences." },
  { at: "0:05", title: "D3-focused school matching", detail: "Reviewing schools, fit context, and match percentages." },
  {
    at: "0:12",
    title: "SmartAdd search",
    detail: "Typing preferences to discover matched schools and adding them to the dashboard.",
  },
  {
    at: "0:20",
    title: "Outreach draft",
    detail:
      "Generating a personalized outreach draft for a college coach, ready for the athlete to review and send from their own inbox.",
  },
  { at: "0:30", title: "Reply tracking", detail: "Seeing which coaches have responded and managing follow-ups." },
  {
    at: "0:40",
    title: "Outreach dashboard",
    detail: "Tracking sent messages, open rates, and engagement for saved schools.",
  },
]

export default function DemoPage() {
  return (
    <RouteShell>
      <PublicHeader accessSource="demo_header" tone="dark" />

      <main id="main-content" tabIndex={-1}>
        {/* The page opens on a deep-green band so the recording reads like a theater, not a card. */}
        <section
          aria-labelledby="demo-heading"
          className="bg-shell px-4 pb-20 pt-28 text-white sm:px-6 sm:pt-32 lg:pb-28 lg:pt-36"
        >
          <div className="mx-auto w-full max-w-2xl text-center">
            <p className={eyebrowDark}>One-minute demo</p>
            <h1 id="demo-heading" className={`mt-5 ${h1Dark}`}>
              See the athlete workflow in under a minute.
            </h1>
            <p className={`mx-auto mt-6 max-w-xl ${ledeDark}`}>
              Follow D3-focused OneScore matches, reviewed outreach from a connected inbox, and coach-reply tracking in
              one focused walkthrough.
            </p>
            <DownloadLink analyticsSource="demo_intro" className={`${pillPrimaryDark} group mt-8`}>
              Get the app
              <ArrowRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
              />
            </DownloadLink>
          </div>

          <div className="mx-auto mt-12 w-full max-w-[560px]">
            <div className="overflow-hidden rounded-hero bg-shell-deep shadow-lift ring-1 ring-white/10">
              <video
                muted
                playsInline
                controls
                poster="/demo-poster.png"
                preload="metadata"
                aria-label="OneCommit product demo video"
                aria-describedby="demo-video-note"
                className="block aspect-square w-full bg-shell-deep object-cover"
              >
                <source src="/demo.mp4" type="video/mp4" />
                <track src="/demo.vtt" kind="captions" label="English" default />
                Your browser does not support the OneCommit demo video.
              </video>
            </div>
            <p
              id="demo-video-note"
              className="mx-auto mt-5 flex max-w-md items-start justify-center gap-2 text-center text-[13px] leading-relaxed text-white/70"
            >
              <Captions aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-mint" />
              <span>
                56-second walkthrough with English captions, recorded on an earlier beta build. Playback starts only
                when you choose it.
              </span>
            </p>
          </div>
        </section>

        <section aria-labelledby="demo-chapters-heading" className={section}>
          <div className={`${container} grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <p className={eyebrow}>What the walkthrough covers</p>
              <h2 id="demo-chapters-heading" className={`mt-4 ${h2}`}>
                Profile, matches, outreach, replies.
              </h2>
              <p className={`mt-4 max-w-md ${lede}`}>
                The recording predates the current app screens shown on the homepage, so some views look different
                from the build in the beta today.
              </p>
            </Reveal>

            <RevealGroup className="border-t border-line">
              {chapters.map((chapter) => (
                <RevealItem key={chapter.at} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6">
                  <span className="text-[13px] font-semibold tabular-nums tracking-[0.06em] text-green">{chapter.at}</span>
                  <div>
                    <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">{chapter.title}</h3>
                    <p className="mt-1.5 text-[16px] leading-relaxed text-ink-soft">{chapter.detail}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        <section aria-label="Get the app" className="px-4 pb-24 sm:px-6 lg:pb-32">
          <Reveal className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-6 rounded-hero bg-canvas-subtle p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <p className="max-w-xl text-[17px] leading-[1.55] text-ink sm:text-[19px]">
              Build your college list from your own marks and grades. Then run the outreach.
            </p>
            <DownloadLink analyticsSource="demo_page" className={`${pillPrimary} group w-full shrink-0 sm:w-auto`}>
              Get the app
              <ArrowRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
              />
            </DownloadLink>
          </Reveal>
        </section>
      </main>

      <FooterSection />
    </RouteShell>
  )
}
