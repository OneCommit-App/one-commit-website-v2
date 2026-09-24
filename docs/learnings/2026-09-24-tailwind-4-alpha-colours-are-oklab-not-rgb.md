# A Tailwind 4 alpha colour is oklab, so a contrast check that parses rgb() silently passes everything

## Problem
A contrast probe reported 1.3:1 and 1.25:1 for `text-white/75` and `text-white/60` on a deep-green band — a fail so bad it would have been visible from across the room. The band was fine (9.17 and 6.39). The probe was reading `oklab(...)` and pulling the first three numbers out of it as if they were 0-255 channels.

## Context that mattered
- Tailwind 4 emits opacity modifiers as `color: color-mix(in oklab, #fff 75%, transparent)`. Chrome resolves that to a **used value of `oklab(…)`**, not `rgba()`.
- The site's own palette (`--oc-*`, plain hex) still computes to `rgb()`, so the same probe returns correct numbers for eyebrows and headings and garbage only for the alpha utilities. A partly-correct probe is worse than a broken one: 9.45 and 15.38 came back alongside the two fakes and made the output look trustworthy.
- Contrast on this site is a gate, not a nicety — a previous pass shipped 1.28:1 nav links on ten routes.

## Approach
1. Never regex `getComputedStyle(el).color`. Let the browser convert it: paint the colour into a 1×1 canvas and read the pixel back.
2. Recover alpha by painting the same colour twice, once over black and once over white, then `a = 1 - (whiteResult.r - blackResult.r) / 255`.
3. Composite the recovered RGBA over the section's own background before computing relative luminance — the alpha is the whole point of the utility.
4. Read the background the same way, because `--oc-shell` in dark mode may itself be a `color()` value.

## Dead ends
- Reading `getComputedStyle(el, '::after').backgroundColor` and eyeballing it: it returns `color(srgb 0.043 0.121 0.094 / 0.035)`, which is correct and still not parseable by a naive `match(/[\d.]+/g)`.
- Assuming a low number meant a real regression and starting to change the design. The design was right; the instrument was wrong.

## Reusable rule
When measuring a computed colour in a Tailwind 4 app, always round-trip it through a canvas pixel before doing arithmetic on it. If a contrast probe returns a number under 2:1 for text that is plainly legible on screen, fix the probe before touching the design.

## Verification
The canvas probe returned eyebrow 9.45, headline 15.38, body 9.17, attribution 6.39 on `bg-shell` — the two plain-rgb values unchanged from the broken probe, the two alpha values corrected from 1.3 and 1.25. Related: [[2026-09-16-three-ways-a-screenshot-lies]].
