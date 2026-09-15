/**
 * Class recipes for the secondary routes. They extend the homepage recipes in
 * components/home/tokens.ts so every public page reads as one system: same
 * canvas, ink, forest accent, hairlines, radii, and type scale.
 */

export const h1 =
  "text-balance text-[2.5rem] font-bold leading-[1.04] tracking-[-0.035em] text-ink sm:text-[3rem] lg:text-[3.25rem]"

export const h1Dark =
  "text-balance text-[2.5rem] font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-[3rem] lg:text-[3.25rem]"

export const h3 = "text-[20px] font-semibold tracking-[-0.015em] text-ink"

/** Hero padding clears the fixed 3.5rem nav with the same rhythm as the homepage hero. */
export const hero = "px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:pb-24 lg:pt-36"

/** Long-form reading copy (about, support, legal). */
export const prose = "max-w-[62ch] text-pretty text-[17px] leading-[1.65] text-ink-soft sm:text-[18px]"

export const ledeDark = "text-pretty text-[17px] leading-[1.55] text-white/70 sm:text-[19px]"

export const proseDark = "max-w-[62ch] text-pretty text-[17px] leading-[1.65] text-white/70 sm:text-[18px]"

/** Quiet text link with a 44px target, used for accountability and recovery rows. */
export const textLink =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full text-[15px] font-semibold text-green transition-colors hover:text-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"

/** Inline link inside a paragraph: underlined, 24px minimum target. */
export const inlineLink =
  "inline-flex min-h-6 items-center rounded-sm px-0.5 font-medium text-green underline decoration-green/30 underline-offset-[3px] transition-colors hover:text-green-mid hover:decoration-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-mid"

/** Rounded icon dot used at the head of list rows. */
export const iconDot = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-soft text-green"

export const iconDotDark = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-mint"
