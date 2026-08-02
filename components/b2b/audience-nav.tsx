import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { audienceOrder, audiences, type AudienceKey } from "@/lib/b2b-audiences"

export default function AudienceNav({ current }: { current: AudienceKey }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[70] rounded-full bg-white px-4 py-3 text-sm font-semibold text-[#0f1a14] focus:not-sr-only"
      >
        Skip to main content
      </a>
      <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:pt-5">
        <nav
          aria-label="Primary"
          className="mx-auto flex min-h-11 w-full max-w-6xl items-center justify-between gap-3 border-b border-white/[0.10]"
        >
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-white outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a14]"
          >
            <Image src="/logo.png" alt="OneCommit logo" width={26} height={26} className="h-6 w-6 rounded-full" />
            <span className="hidden min-[360px]:inline">OneCommit</span>
          </Link>
          <Link
            href="/"
            aria-label="Back to athlete site"
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-xs font-semibold text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a14]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span className="hidden min-[260px]:inline">Athlete site</span>
          </Link>
        </nav>
        <nav
          aria-label="Audience pages"
          className="mx-auto mt-3 flex w-full max-w-6xl flex-wrap gap-2"
        >
          {audienceOrder.map((key) => {
            const audience = audiences[key]
            const isCurrent = key === current
            return (
              <Link
                key={key}
                href={audience.path}
                aria-current={isCurrent ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-3 py-2 text-xs font-semibold outline-none transition-colors min-[240px]:px-4 focus-visible:ring-2 focus-visible:ring-[#86efac] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a14] ${
                  isCurrent
                    ? "border-[#86efac]/40 bg-[#86efac]/15 text-[#b9f6d0]"
                    : "border-white/10 bg-[#0f1a14]/75 text-white/65 hover:border-white/20 hover:text-white"
                }`}
              >
                {audience.shortLabel}
              </Link>
            )
          })}
        </nav>
      </header>
    </>
  )
}
