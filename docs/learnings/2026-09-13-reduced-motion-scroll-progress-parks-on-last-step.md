# Reduced motion: an ungated scroll-progress listener parks a scrollytelling section on its last step

## Problem
With `prefers-reduced-motion: reduce`, the "How it works" section loaded on step 5 and snapped back
to step 5 after any step button click. Surface symptom: "step buttons are broken under reduced
motion." Real cause: the wrapper collapses to `height: auto` in that mode, so
`useScroll({ target, offset: ["start start", "end end"] })` has zero travel, `scrollYProgress` reads 1,
and the still-subscribed `useMotionValueEvent(scrollYProgress, "change")` kept writing
`floor(1 * steps) = 4` into `active`.

## Context that mattered
- `useStill()` (components/reveal.tsx) is false on the server and first client render and flips to
  true after mount, so every scroll-driven branch must tolerate the flip, not just the initial value.
- `useMotionValueEvent` resubscribes when the callback identity changes, so an inline handler that
  closes over `still` sees the new value on the next render; no ref is needed.
- Hooks cannot be called conditionally, so the gate has to live inside the handler, not around it.

## Approach
1. Inside the `"change"` handler: `if (still) return` before computing the next step.
2. `useEffect(() => { if (still) setActive(0) }, [still])` so a stray progress event that landed
   before the flip cannot leave the section parked mid-sequence.
3. Keep `goTo(index)` as `setActive` only when `still` (no `scrollTo`), and stop dimming inactive
   steps in that mode (`dimmed = !isActive && !still`) so all five stay readable.
4. Any decorative progress bound to `scrollYProgress` gets an active-based value under `still`
   (`(active + 1) / steps.length`), since progress is meaningless once the wrapper is `auto`.

## Dead ends
- Treating "wrapper is `height:auto` and panel is static" as the whole reduced-motion story
  ([[2026-09-09-pinned-scrollytelling-px-capped-travel]] step 4): the layout was right, the
  still-live listener was the bug. Signal: CDP with `Emulation.setEmulatedMedia`
  (`prefers-reduced-motion: reduce`) reported `aria-current="step"` on step 5 at load.

## Reusable rule
When a scroll-linked hook keeps running after the element it measures stops scrolling (reduced
motion, static fallback, collapsed height), gate the listener's effect on that mode explicitly and
reset the derived state when the mode flips; never rely on the layout change alone.

## Verification
`node review.mjs http://127.0.0.1:3233/ <out> rm` (scratchpad CDP script, prod build): `matchMedia
reduce: true`, `rm active on load: 1B`, `after click step 3: 3S`, `after scrolling: 3S`, wrapper
`height: auto`, all five step titles `rgb(11, 31, 24)`; mobile dots current index 2 after the click.
