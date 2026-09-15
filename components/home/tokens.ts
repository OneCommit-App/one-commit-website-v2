/**
 * Shared homepage class recipes. Colors come from the app palette declared in
 * app/globals.css (bg-canvas, text-ink, bg-shell, text-mint, ...).
 */

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"

export const focusRingDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-shell"

export const section = "px-4 py-24 sm:px-6 lg:py-32"

/* The one page rail. Heroes used to set max-w-[1200px] inline while every section
   used max-w-6xl (1152), so content stepped 24px in and out down a single scroll. */
export const container = "mx-auto w-full max-w-[1200px]"

export const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.14em] text-green"

export const eyebrowDark = "text-[13px] font-semibold uppercase tracking-[0.14em] text-mint"

/* Section heads sit a clear step below the hero so the page has one display moment
   rather than ten equal ones. Leading steps with size: 1.05 is correct tightening at
   42px and leaves nothing between a descender and the next ascender at 32px. */
export const h2 =
  "text-balance text-[2rem] font-bold leading-[1.14] tracking-[-0.03em] text-ink sm:text-[2.25rem] sm:leading-[1.08] lg:text-[2.625rem] lg:leading-[1.05]"

export const h2Dark =
  "text-balance text-[2rem] font-bold leading-[1.14] tracking-[-0.03em] text-white sm:text-[2.25rem] sm:leading-[1.08] lg:text-[2.625rem] lg:leading-[1.05]"

export const lede = "text-pretty text-[17px] leading-[1.55] text-ink-soft sm:text-[19px]"

/* min-h-11 is redundant beside h-12 but states the 44px floor explicitly, so the
   target-size assertions can read it off any pill built from this recipe. */
const pillBase =
  "inline-flex h-12 min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold transition-colors"

export const pillPrimary = `${pillBase} bg-green text-on-green shadow-cta hover:bg-green-mid ${focusRing}`

export const pillSecondary = `${pillBase} text-ink ring-1 ring-inset ring-ink/15 hover:bg-ink/5 ${focusRing}`

export const pillPrimaryDark = `${pillBase} bg-white text-shell hover:bg-mint ${focusRingDark}`

export const pillSecondaryDark = `${pillBase} text-white ring-1 ring-inset ring-white/25 hover:bg-white/10 ${focusRingDark}`
