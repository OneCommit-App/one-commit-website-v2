import Link from "next/link"
import { ArrowRight, Compass, LifeBuoy } from "lucide-react"
import FooterSection from "@/components/footer-section"
import PublicHeader from "@/components/public-header"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1a14] text-white">
      <PublicHeader accessSource="not_found_header" />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-[62vh] items-center justify-center px-4 py-16 text-center"
      >
        <section aria-labelledby="not-found-heading" className="w-full max-w-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e6b85c]/25 bg-[#e6b85c]/10 text-[#f3d28d]">
            <Compass aria-hidden="true" size={26} />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#f3d28d]">404 · Page not found</p>
          <h1 id="not-found-heading" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            This page missed the mark.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/65">
            The link may be outdated, but your recruiting plan does not have to stop here. Return home or contact us if you expected something else.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#0f1a14] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a14]"
            >
              Go to OneCommit
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <Link
              href="/support"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6b85c]"
            >
              <LifeBuoy aria-hidden="true" size={15} />
              Contact support
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
