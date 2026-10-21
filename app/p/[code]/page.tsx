import type { Metadata } from "next"
import Image from "next/image"
import { focusRing } from "@/components/home/tokens"
import RouteShell from "@/components/routes/route-shell"
import { resolveApiBaseUrl } from "@/lib/parent-pay"
import ParentPayView from "./parent-pay-view"

/*
 * onecommit.us/p/<code>: the page an athlete's parent opens from a text (C3).
 * The API decides everything (lane B5); this route renders a shell and hands
 * the browser the API origin and the app's client key, so each parent's calls
 * reach the API's per-IP limiter from their own address.
 *
 * Rendered per request: the env is read at request time, and no copy of a
 * private link's page is ever cached. next.config.mjs adds `X-Robots-Tag`
 * and `Referrer-Policy: no-referrer` for /p/*; the tags below repeat both.
 * Stripe returns the parent to `/p/<code>?paid=1` (the API's success_url), so
 * the success state lives on this same route.
 *
 * Links here are plain <a>, not next/link: leaving this page is a full
 * navigation, so the next page starts with no referrer and nothing prefetches.
 */
export const dynamic = "force-dynamic"

const shareTitle = "OneCommit Recruiting Pass"
const shareDescription = "One payment. Nothing renews."

export const metadata: Metadata = {
  title: "Recruiting Pass",
  description: shareDescription,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
  alternates: { canonical: null },
  // The link preview in Messages: no name, no code, no address.
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    siteName: "OneCommit",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "OneCommit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: ["/opengraph-image"],
  },
}

type PageProps = {
  params: Promise<{ code: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const footerLink = `inline-flex min-h-11 items-center rounded-md px-1 transition-colors hover:text-ink ${focusRing}`

export default async function ParentPayPage({ params, searchParams }: PageProps) {
  const [{ code }, query] = await Promise.all([params, searchParams])

  return (
    <RouteShell className="flex flex-col">
      {/* One wash behind the header and the content, starting above the fold. */}
      <div className="oc-wash relative isolate flex-1 overflow-x-clip">
        <header className="px-4 pt-3 sm:px-6 sm:pt-5">
          <div className="mx-auto flex w-full max-w-[30rem] items-center">
            {/* A full navigation on purpose (see the note at the top of this file). */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              aria-label="OneCommit home"
              className={`-mx-2 flex min-h-11 items-center gap-2 rounded-lg px-2 text-ink ${focusRing}`}
            >
              <Image src="/logo.png" alt="" width={28} height={28} priority className="h-7 w-7 rounded-full" />
              <span className="text-[15px] font-semibold tracking-[-0.01em]">OneCommit</span>
            </a>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="px-4 pb-12 pt-6 focus:outline-none sm:px-6 sm:pt-12">
          {/* overflow-wrap: anywhere lets a long first name (the API sends up
              to 40 characters) break instead of running off a small screen. */}
          <div className="mx-auto w-full max-w-[30rem] [overflow-wrap:anywhere]">
            <ParentPayView
              rawCode={code}
              paid={query.paid === "1"}
              apiBaseUrl={resolveApiBaseUrl(process.env.ONECOMMIT_API_BASE_URL)}
              apiKey={process.env.ONECOMMIT_API_KEY?.trim() || ""}
            />
            <noscript>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">This page needs JavaScript to load.</p>
            </noscript>
          </div>
        </main>
      </div>

      <footer className="px-4 pb-8 sm:px-6">
        <nav
          aria-label="Policies and support"
          className="mx-auto flex w-full max-w-[30rem] flex-wrap items-center justify-center gap-x-4 text-[13px] text-ink-soft"
        >
          <a href="/privacy" className={footerLink}>
            Privacy
          </a>
          <a href="/terms" className={footerLink}>
            Terms
          </a>
          <a href="mailto:admin@onecommit.us" className={footerLink}>
            admin@onecommit.us
          </a>
        </nav>
      </footer>
    </RouteShell>
  )
}
