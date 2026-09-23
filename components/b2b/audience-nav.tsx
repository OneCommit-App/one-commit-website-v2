import Link from "next/link"
import PublicHeader from "@/components/public-header"
import { audienceOrder, audiences, type AudienceKey } from "@/lib/b2b-audiences"

const chipClass =
  "inline-flex min-h-11 items-center rounded-full border px-4 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"

/**
 * Header assembly for the audience pages: the skip link, the shared frosted
 * navigation, and a row of audience switches that sits under the nav at the top
 * of the hero (the hero pads itself to clear it, wrapping rows included).
 */
export default function AudienceNav({ current }: { current: AudienceKey }) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-0 z-[100] inline-flex min-h-11 -translate-y-full items-center rounded-full bg-green px-4 text-sm font-semibold text-on-green transition-transform focus:top-4 focus:translate-y-0 focus:shadow-cta focus:outline-none focus:ring-2 focus:ring-green-mid focus:ring-offset-2 focus:ring-offset-canvas"
      >
        Skip to main content
      </a>
      <PublicHeader accessSource={`${audiences[current].eventSource}_header`} skipLink={false} />
      <nav aria-label="Audience pages" className="absolute inset-x-0 top-14 z-30 px-4 pt-3 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap gap-2">
          {audienceOrder.map((key) => {
            const audience = audiences[key]
            const isCurrent = key === current
            return (
              <Link
                key={key}
                href={audience.path}
                aria-current={isCurrent ? "page" : undefined}
                className={`${chipClass} ${
                  isCurrent
                    ? "border-green bg-green text-on-green"
                    : "border-line bg-card text-ink-soft hover:border-ink/20 hover:text-ink"
                }`}
              >
                {key === "athletic-programs" ? (
                  <>
                    <span className="hidden min-[260px]:inline">{audience.shortLabel}</span>
                    <span className="min-[260px]:hidden">Programs</span>
                  </>
                ) : (
                  audience.shortLabel
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
