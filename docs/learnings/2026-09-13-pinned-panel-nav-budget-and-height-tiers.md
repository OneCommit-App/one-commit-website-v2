# Pinned desktop panel: budget the fixed nav into the pin and tier the copy by viewport height

## Problem
On 1280x640 to 1440x780 desktop viewports the pinned "How it works" copy column started under the
56px fixed nav and its fifth step ran past the viewport bottom for the whole scrollytelling run. Real
cause: the panel was `min(100svh, 56rem)` tall with `top: (100svh - height) / 2`, which is `0` on any
viewport under 896px, and the 672px copy column plus `py-16` needed 800px of panel regardless.

## Context that mattered
- `components/home/site-nav.tsx` is `fixed top-0 h-14`, so the top 3.5rem of every viewport is covered.
- The full lg column measures 672px (eyebrow 19.5 + h2 109 + list 5 x 99); it fits only when
  `100svh >= 56 + 128 + 672 = 856`. Any tier must be derived from that arithmetic, not eyeballed.
- Tailwind v4 emits custom variants after built-ins, in declaration order, and a stacked candidate
  after its prefix, so `lg:short:py-8` always beats `lg:py-16` and `lg:shorter:*` beats `lg:short:*`.
- Mobile fit was already tuned ([[2026-09-13-pinned-panel-budget-on-se-class-viewports]]); its content
  box (72px to `svh - 24px`) had to stay byte-identical.

## Approach
1. `panelHeight = min(100svh - 3.5rem, 56rem)` and `top = 3.5rem + (100svh - 3.5rem - panelHeight) / 2`:
   the panel centers under the nav and its top lands exactly on the nav edge whenever it fills the space.
2. Keep mobile identical by trading `pt-[4.5rem]` for `pt-4` (56 + 16 = 72, as before).
3. Declare `@custom-variant short (@media (max-height: 53.4375rem))` (< 856px) and
   `shorter (max-height: 47.9375rem)` (< 768px) in `app/globals.css`; stack them under `lg:` in the
   component so they only touch the pinned desktop column, and pass empty strings under reduced motion.
4. `short`: `py-8`, h2 2.75rem, list `mt-6`, items `py-2` (581px column, needs 747px, so 768 is slack).
   `shorter`: `py-6`, h2 2.25rem, `mt-4`, `py-1.5`, and inactive descriptions fold via a
   `grid-rows-[1fr]` -> `grid-rows-[0fr]` transition on a wrapper with `min-h-0 overflow-hidden`.
5. Prove the cascade order in the built CSS (`indexOf` of each selector in `.next/static/css/*.css`)
   before trusting it, then measure on `next start`, not the dev server.

## Dead ends
- Keeping every description in `shorter` with tighter leading: 514px column against 536px available
   at 640, and any 3-line description or window under 620px breaks it. Signal: the arithmetic.
- Fluid `clamp(..., Nsvh, ...)` padding and font-size instead of tiers: single declarations avoid the
  cascade question, but nothing binary (hiding descriptions) can be expressed that way. Rejected on paper.
- Plain unlayered CSS in `globals.css` overriding utilities: deterministic, but it splits the component's
  styling across two files for no gain once the variant order was verified.

## Reusable rule
When a sticky panel pins under a fixed header, subtract the header from both the panel height and its
`top` on every breakpoint, and derive each height tier's threshold from the measured column height plus
padding plus header; verify any stacked-variant override by locating both selectors in the built CSS.

## Verification
`node rep2/measure.mjs http://127.0.0.1:3251 <out>` on the production build (CDP, real-time waits):
1280x640 `colTop 170 colBottom 526`, 1366x690 `195/551`, 1440x780 `128/708`, 1440x900 `142/814`
(panel `56..innerHeight` in every case), 375x667 `phoneW 157 dotsBottom 606` unchanged, reduced motion
unpinned with all five descriptions at 50px, 0 console errors. Full gate run exit=0 x10.
Related: [[2026-09-09-pinned-scrollytelling-px-capped-travel]].
