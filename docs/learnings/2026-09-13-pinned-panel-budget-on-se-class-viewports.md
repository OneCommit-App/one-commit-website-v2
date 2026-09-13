# Pinned mobile panel: move the heading out of the pin and clamp the phone from a height budget

## Problem
At 375x667 the "How it works" phone frame shrank to 111px (`w-[min(190px,calc((100svh-27rem)/2.11))]`),
an unreadable screen. Real cause: the pinned `100svh` panel had to hold nav clearance, eyebrow + h2,
the phone, the step copy, and the dots, and the only elastic item was the phone.

## Context that mattered
- The panel is `position: sticky; height: 100svh` on small screens, so anything that overflows it is
  drawn below the viewport bottom, never scrollable; every child must fit inside one viewport.
- The phone frame is `aspect-ratio: 0.474`, so its height is `width * 2.11`; the width formula is the
  budget inverted.
- The desktop layout keeps the heading beside the step list inside the panel (design intent), so the
  heading cannot simply move for every breakpoint.

## Approach
1. Render the eyebrow + h2 twice: a `lg:hidden` block above the sticky wrapper (scrolls away before
   the pin) and the original `hidden lg:block` column inside the panel; keep `aria-labelledby` on the
   desktop id (a directly referenced hidden node still supplies the accessible name).
2. Measure the fixed budget in the pinned panel: 4.5rem of nav clearance (since
   [[2026-09-13-pinned-panel-nav-budget-and-height-tiers]]: sticky `top: 3.5rem` + `pt-4`) + 2 x `gap-6` + copy
   `min-h-[8.5rem]` (tallest 3-line description) + dots `h-11` + `mt-2` + `pb-6` = ~21rem.
3. Phone width `clamp(150px, calc((100svh - 21rem) / 2.11), 190px)`: the budget sets it, the floor
   keeps it readable, the cap keeps it from dominating tall phones.
4. Give the crossfading copy block a `min-h` that holds the tallest step, because the items are
   absolutely positioned and would otherwise overlap the dots.

## Dead ends
- Raising only the floor (`max(150px, ...)`) with the heading still pinned: 72 + 103 + 24 + 317 + 24 +
  134 + 52 + 32 = 758px > 667px, so the dots fell below the viewport. Signal: the arithmetic, before
  any capture.
- `overflow-y: auto` on the pinned panel: nested scrolling inside a scroll-driven section; rejected
  without trying.

## Reusable rule
When a sticky panel must fit one viewport, list every child's fixed height first, put the one
elastic child on a `clamp(floor, budget, cap)` derived from that list, and move any child that only
needs to be read once (headings) out of the pinned region on the breakpoint where space is short.

## Verification
`node review.mjs http://127.0.0.1:3233/ <out> se` (prod build): 375x667 `phoneW 157, dotsBottom 606,
fits true`; 375x812 and 390x844 `phoneW 190, dotsBottom 674, fits true`; copy items all 136px.
Related: [[2026-09-09-pinned-scrollytelling-px-capped-travel]].
