import { ArrowRight, Captions, CirclePlay } from "lucide-react"
import DownloadLink from "@/components/download-link"
import FooterSection from "@/components/footer-section"
import PublicHeader from "@/components/public-header"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0f1a14] text-white">
      <PublicHeader accessSource="demo_header" />

      <main id="main-content" tabIndex={-1} className="px-4 pb-16 pt-14 sm:pt-16">
        <section aria-labelledby="demo-heading" className="mx-auto flex w-full max-w-4xl flex-col items-center">
          <div className="mb-8 max-w-2xl text-center">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#f3d28d]">
              <CirclePlay aria-hidden="true" size={14} />
              Product demo
            </div>
            <h1 id="demo-heading" className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              See the athlete workflow in under a minute
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Follow D3-focused OneScore matches, reviewed outreach from a connected inbox, and coach-reply tracking in one focused walkthrough.
            </p>
            <DownloadLink
              analyticsSource="demo_intro"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0f1a14] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a14]"
            >
              Get the app
              <ArrowRight aria-hidden="true" size={15} />
            </DownloadLink>
          </div>

          <div className="w-full overflow-hidden rounded-2xl border border-white/[0.1] bg-black/25 p-1.5 shadow-[0_24px_90px_rgba(0,0,0,0.34)] sm:p-2">
            <video
              muted
              playsInline
              controls
              poster="/demo-poster.png"
              preload="metadata"
              aria-label="OneCommit product demo video"
              aria-describedby="demo-video-note"
              className="block aspect-square w-full rounded-xl object-cover"
            >
              <source src="/demo.mp4" type="video/mp4" />
              <track src="/demo.vtt" kind="captions" label="English" default />
              Your browser does not support the OneCommit demo video.
            </video>
          </div>

          <div id="demo-video-note" className="mt-4 flex items-center gap-2 text-sm text-white/55">
            <Captions aria-hidden="true" size={16} className="text-[#86efac]" />
            56-second walkthrough with English captions. Playback starts only when you choose it.
          </div>

          <DownloadLink
            analyticsSource="demo_page"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"
          >
            Get the app
            <ArrowRight aria-hidden="true" size={15} />
          </DownloadLink>
        </section>
      </main>

      <FooterSection />
    </div>
  )
}
