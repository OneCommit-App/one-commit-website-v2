# Horizontal overflow that appears only at some widths: read the exact pixel delta

## Problem
`scrollWidth > innerWidth` at 768 (787) and 1024 (1027) only, clean at 375-500 and 1280-1536. Surface
symptom looked like a breakpoint bug; real cause was one absolute ambient-glow `div` with
`inset-x-[-6%]` inside a section that had no `overflow-x-clip`.

## Context that mattered
- Absolutely positioned children still contribute to the scrollable overflow area unless an ancestor
  clips; `filter: blur()` does not, so only the element box matters.
- At 768 the column was full width (736px; 6% = 44px beyond the right edge minus 16px padding = 19px
  overflow). At 1024 the two-column grid made the column 456px (6% = 27px beyond, minus 24px = 3px).
  Both deltas matched the measured values exactly, which identified the element without bisecting CSS.
- `body { overflow-x: hidden }` propagates to the viewport and does not hide the measurement.

## Approach
1. Probe `document.documentElement.scrollWidth` vs `window.innerWidth` at eight widths over CDP.
2. For each failing width, compute which absolute/transformed element's box would extend past the
   viewport by exactly that many pixels.
3. Fix at the source: `overflow-x-clip` on the section (safe for sticky descendants) and pull the glow
   inside the column (`inset-x-[6%]`).

## Dead ends
- Suspecting the 3D-rotated hero phone: its section already had `overflow-x-clip` and 1280+ were clean.

## Reusable rule
When horizontal overflow is width-dependent, take the exact `scrollWidth - innerWidth` delta at each
failing width and match it to a candidate's geometry before touching any CSS.

## Verification
`node shot.mjs http://127.0.0.1:3777/ out` -> `overflow 768 {"sw":768,"iw":768} OK` and
`overflow 1024 {"sw":1024,"iw":1024} OK` (all eight widths OK on the production build).
