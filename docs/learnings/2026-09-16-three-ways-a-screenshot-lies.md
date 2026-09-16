# Three ways a visual-verification screenshot silently shows you the wrong page

## Problem
Across one redesign pass, three separate mechanisms each produced confident, wrong conclusions from CDP captures — a styling change that "didn't work" (it had), a container width that "didn't apply" (it had), and an Open Graph card that appeared to contradict the site's own download state (it didn't). Every one looked like a real defect and none was.

## Context that mattered
- **Stale build.** `scripts/download-states.test.mjs` is the last step of the release gate and rebuilds `.next` five times, leaving the LAST (download-configured) build behind. Anything served afterwards renders a state the real site is not in — that is how the OG card came to read "Download OneCommit" while the header read "Request Beta Access". Running the gate's individual tests out of order reproduces it too.
- **Browser cache.** Chrome served a cached document after a rebuild, so a measurement reported `672px` for a box whose source said `38rem` (608px). The source, the build and the server were all correct; only the tab was behind.
- **Smooth scroll.** `html { scroll-behavior: smooth }` is set globally, so a programmatic `window.scrollTo(0, y)` animates. A capture on a fixed timer lands mid-flight: a request for the top of the hero returned a frame ~800px down the page.

## Approach
1. Trust the served bytes over the source. Ask the page what it actually loaded — `document.styleSheets.map(s => s.href)` — and compare against `ls .next/static/css/`. A hash the build directory does not contain proves the server is stale.
2. Put the rebuild inside the serve script, not in the operator's memory: `pnpm build` then `next start`, every time.
3. `Network.setCacheDisabled {cacheDisabled: true}` on every CDP session that measures or captures.
4. `window.scrollTo({top, behavior: "instant"})` for every programmatic scroll, and assert the element is where you asked before capturing.

## Dead ends
- Re-running the same capture to "confirm" a finding: all three failure modes are perfectly reproducible, so a second identical result reads as corroboration when it is the same lie told twice.
- Raising CSS specificity to force a change through — there was nothing to force; the browser had never seen the file.

## Reusable rule
A screenshot is evidence about a *served build in a particular tab*, not about your source. Before believing one, pin all three: rebuild inside the serve step, disable the cache in the session, and make every scroll instant. When a visual finding contradicts what the source plainly says, suspect the harness before the code — and check the stylesheet hash first, because it settles it in one query.

## Verification
The stale-build case was settled by `document.styleSheets` returning `5e38838cbd8f4fbb.css`, a hash absent from `.next/static/css/`. Cache and scroll were each settled by a single measurement flipping to the expected value after the one-line fix (672→608px; a hero crop moving from y≈800 to y=0). Related: [[2026-09-15-a-killed-pnpm-wrapper-leaves-the-real-server-listening]] and [[2026-09-13-dev-server-500-after-a-production-build-shares-next]].
