/**
 * Shared homepage class recipes. Colors come from the app palette declared in
 * app/globals.css (bg-canvas, text-ink, bg-shell, text-mint, ...).
 */

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"

export const focusRingDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-shell"

export const section = "px-4 py-24 sm:px-6 lg:py-32"

export const container = "mx-auto w-full max-w-6xl"

export const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.14em] text-green"

export const eyebrowDark = "text-[13px] font-semibold uppercase tracking-[0.14em] text-mint"

export const h2 =
  "text-balance text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.25rem]"

export const h2Dark =
  "text-balance text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3.25rem]"

export const lede = "text-pretty text-[17px] leading-[1.55] text-ink-soft sm:text-[19px]"

const pillBase =
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[15px] font-semibold transition-colors"

export const pillPrimary = `${pillBase} bg-green text-on-green shadow-cta hover:bg-green-mid ${focusRing}`

export const pillSecondary = `${pillBase} text-ink ring-1 ring-inset ring-ink/15 hover:bg-ink/5 ${focusRing}`

export const pillPrimaryDark = `${pillBase} bg-white text-shell hover:bg-mint ${focusRingDark}`

export const pillSecondaryDark = `${pillBase} text-white ring-1 ring-inset ring-white/25 hover:bg-white/10 ${focusRingDark}`
