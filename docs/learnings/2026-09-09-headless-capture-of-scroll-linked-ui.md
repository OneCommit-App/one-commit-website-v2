# Headless capture of scroll-linked UI: use CDP with real time, not --screenshot + virtual time

## Problem
Verifying a scroll-linked homepage (frosted nav, sticky scrollytelling, `whileInView` reveals) with
`chrome --headless=new --screenshot` produced misleading evidence: the tall (1440x6000) capture with
`--virtual-time-budget` showed every `Reveal`-wrapped section blank, and `--screenshot` cannot scroll
at all. Surface symptom: "production build hides half the page." Real cause: virtual time freezes
compositor-driven (WAAPI) opacity animations at frame one; the dev capture only worked by luck of timing.

## Context that mattered
- framer-motion 12 runs `opacity`/`transform` animations through WAAPI; they do not advance under
  Chrome's virtual-time budget, so anything that starts at `opacity: 0` stays there in the capture.
- The Browser pane (`mcp__Claude_Browser__*`) scales an emulated 1440x900 viewport to fit its pane and
  its screenshots did not reflect `window.scrollTo`; unusable for this check.
- Node 25 ships `fetch` and a global `WebSocket`, so a CDP client needs no dependency.

## Approach
1. Launch Chrome headless with `--remote-debugging-port=<random>` and a scratch `--user-data-dir`.
2. `PUT /json/new?about:blank`, open the `webSocketDebuggerUrl`, send `Page.enable`,
   `Emulation.setDeviceMetricsOverride`, `Page.navigate`, then wait real time (5s dev, 7s prod).
3. For each shot: `Runtime.evaluate` `window.scrollTo({top, behavior:"instant"})` where `top` is
   computed from `getBoundingClientRect().top + scrollY` of a section/heading id, wait 1.5s,
   `Page.captureScreenshot`. Downscale with `sips -Z 960` before reading many images.
4. Probe overflow at 375/390/500/768/1024/1280/1440/1536 via
   `document.documentElement.scrollWidth === window.innerWidth`.
5. Reduced motion: `Emulation.setEmulatedMedia` with `prefers-reduced-motion: reduce` before navigate,
   confirm with `matchMedia(...).matches`, then recapture the pinned section.
Script lived at the session scratchpad as `shot.mjs` / `shot-rm.mjs` / `shot-tall.mjs` (~60 lines each).

## Dead ends
- `chrome --screenshot "http://host/#anchor"` to scroll to a section: produced 5.8 KB blank PNGs.
- `--virtual-time-budget=8000` on the dev server looked complete, on `next start` it did not; the
  difference was timing luck, not a build difference (real-time CDP captures of the same prod build
  rendered every section).

## Reusable rule
When a page animates on scroll or on view, never accept a `--screenshot`/virtual-time capture as proof;
capture over CDP with real waits, and count `[style*="opacity"]` elements whose computed opacity is 0
to distinguish "below the fold" from "stuck".

## Verification
`node shot.mjs http://127.0.0.1:3777/ out` printed `overflow <w> ... OK` for all eight widths and
`desk-11-how-5 ... scrollY 7648` with step 5 highlighted; `RM=1 node shot-rm.mjs` printed
`matchMedia reduce: true` and `how-it-works wrapper height: 945` (unpinned static block).
Related: [[2026-09-09-pinned-scrollytelling-px-capped-travel]]
