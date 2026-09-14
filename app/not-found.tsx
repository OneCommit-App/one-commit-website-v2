import Link from "next/link"
import { ArrowRight, LifeBuoy } from "lucide-react"
import FooterSection from "@/components/footer-section"
import { eyebrow, lede } from "@/components/home/tokens"
import PublicHeader from "@/components/public-header"
import RouteShell from "@/components/routes/route-shell"
import { h1 } from "@/components/routes/tokens"

export default function NotFound() {
  return (
    <RouteShell>
      <PublicHeader accessSource="not_found_header" />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-[72vh] items-center justify-center px-4 pb-24 pt-28 text-center sm:px-6 sm:pt-32"
      >
        <section aria-labelledby="not-found-heading" className="w-full max-w-2xl">
          <p className={eyebrow}>404 · Page not found</p>
          <h1 id="not-found-heading" className={`mt-5 ${h1}`}>
            This page missed the mark.
          </h1>
          <p className={`mx-auto mt-6 max-w-lg ${lede}`}>
            The link may be outdated, but your recruiting plan does not have to stop here. Return home or contact us if
            you expected something else.
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="group inline-flex h-12 min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-green px-6 text-[15px] font-semibold text-white shadow-cta transition-colors hover:bg-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              Go to OneCommit
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out-quint group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/support"
              className="inline-flex h-12 min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold text-ink ring-1 ring-inset ring-ink/15 transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <LifeBuoy size={16} aria-hidden="true" className="text-green-mid" />
              Contact support
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </RouteShell>
  )
}
