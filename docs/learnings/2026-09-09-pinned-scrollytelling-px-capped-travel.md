# Pinned scrollytelling: cap panel height and per-step travel in px, not only svh

## Problem
A sticky "How it works" section sized as `steps * 100svh` (panel `h-[100svh]`) became 30,000px tall in
a 1440x6000 capture viewport and pushed every later section out of the deliverable screenshot; in a
900px browser it also demanded ~4,500px of scrolling for five steps.

## Context that mattered
- `useScroll({ target, offset: ["start start", "end end"] })` maps progress over
  `wrapperHeight - viewportHeight`, so the pin duration is whatever the wrapper adds beyond one viewport.
- A sticky element sits in normal flow until it would cross its `top`; on a viewport taller than the
  wrapper the panel simply rests at the wrapper's top, so a px-capped panel stays visible in tall captures.
- Ancestors with `overflow: hidden` break `position: sticky`; `overflow-x: clip` does not.

## Approach
1. `panelHeight = "min(100svh, 56rem)"`, `stepTravel = "min(80svh, 40rem)"`.
2. Wrapper `height: calc(panelHeight + steps * stepTravel)`; panel
   `position: sticky; top: calc((100svh - panelHeight) / 2); height: panelHeight`.
3. Active step `= floor(progress * steps)` from `useMotionValueEvent(scrollYProgress, "change")`;
   step buttons `scrollTo(top + travel * (i + 0.5) / steps)`.
4. Reduced motion: `useStill()` (mounted-gated `useReducedMotion`) switches the wrapper to `height:auto`
   and the panel to a static block; the same buttons swap the screen without scrolling.
   Not sufficient on its own: the `"change"` listener must also be gated, see
   [[2026-09-13-reduced-motion-scroll-progress-parks-on-last-step]]; the mobile panel budget is in
   [[2026-09-13-pinned-panel-budget-on-se-class-viewports]].
5. Mobile panel: `justify-start pt-20` (nav clearance) instead of `items-center`; centered content that
   is taller than the panel overflows equally top and bottom and tucks under a fixed nav.

## Dead ends
- `h-[100svh] items-center` on mobile: the eyebrow slid under the 56px fixed nav at 390x844.
- Section without `overflow-x-clip`: an ambient glow with `inset-x-[-6%]` leaked 19px at 768 and 3px at
  1024 (see [[2026-09-09-horizontal-overflow-from-negative-inset-glow]]).

## Reusable rule
When a section pins for N steps, size both the pinned panel and the per-step scroll distance with
`min(<viewport unit>, <px cap>)`; then verify in a viewport taller than the wrapper and in one shorter
than the panel.

## Verification
Real-time CDP captures at `how-it-works + 0/900/1550/2200/2900px` showed steps 1-5 highlighted with the
matching app screen; wrapper height 4,096px at 900px viewport; `home-ssr.test.mjs` still green.
