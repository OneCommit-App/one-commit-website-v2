# Crop a device frame at a band's edge with a negative margin, not a clip box

## Problem
The CTA phone (components/cta-section.tsx) looked like a chopped screenshot: a fixed-height `overflow-hidden` box sliced it mid-screen, and because the section still had 96-128px of bottom padding under that box, the cut edge floated above the band's bottom. Surface symptom: "cropped phone"; real cause: the clip line and the band edge were two different lines.

## Context that mattered
- `DeviceFrame` is a CSS-drawn iPhone whose height is width / 0.474, so a 340px phone is ~699px tall; no fixed-height column short of that can hold it whole.
- The section already has `overflow-hidden` (for its glow), so it can be the clipper for free.
- Section padding is `py-24 lg:py-32`; Tailwind negative margins exist at the same scale (`-mb-24`, `lg:-mb-32`).
- `Reveal` is a plain `motion.div` that forwards `className`, so grid alignment and margins on it work normally.

## Approach
1. Remove `overflow-hidden` from the phone wrapper; its height now means "visible slice", not "clip box".
2. Give the phone column `self-end` plus a negative bottom margin equal to the section's bottom padding (`-mb-24 lg:-mb-32` for `py-24 lg:py-32`). Its border box then ends exactly on the section's padding edge, which is the band's visible edge.
3. Let the section's `overflow-hidden` crop everything past that edge. The phone now "rises" out of the band, Apple product-band style.
4. Pick the slice height so the edge lands in clean UI (here 492px at lg: 12px above the welcome screen's white button; 420px at sm; 380px on mobile). A sliver of a control at the edge reads as accidental.
5. Read back geometry via CDP: `section.getBoundingClientRect().bottom` must equal the wrapper bottom, and the device rect must extend past it.

## Dead ends
- Shrinking the phone to fit the box whole (243px at lg) kept the frame honest but made the hero device smaller than the feature-band phones; rejected before building.
- Keeping the clip box and just moving it down: still two separate lines (box bottom vs band edge) that drift whenever padding changes.

## Reusable rule
When a device or card should look "cropped by the band", make the section's own overflow the clipper and pull the element down by exactly the section's bottom padding; never crop with an inner fixed-height overflow box, because its bottom will never coincide with the band edge.

## Verification
`next start -p 3240` on the gated build, then `node scratchpad/cta-shot.mjs`: at 1440x900 `section.bottom 673`, `device.top 181`, `device.bottom 880` (207px past the edge); at 390x844 `section.bottom 976`, device 596..1184. Captures reviewed by eye at 1440x900, 1280x720, 390x844: phone meets the edge, no gap, no white sliver. Related: [[2026-09-13-dev-server-500-after-a-production-build-shares-next]].
