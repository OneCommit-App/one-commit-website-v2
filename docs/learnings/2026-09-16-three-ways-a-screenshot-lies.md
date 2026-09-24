# Five ways a visual-verification screenshot silently shows you the wrong page

## Problem
Across one redesign pass, three separate mechanisms each produced confident, wrong conclusions from CDP captures; a later craft pass added two more, both of which return a frame that is not what the page is currently painting — a styling change that "didn't work" (it had), a container width that "didn't apply" (it had), and an Open Graph card that appeared to contradict the site's own download state (it didn't). Every one looked like a real defect and none was.

## Context that mattered
- **Stale build.** `scripts/download-states.test.mjs` is the last step of the release gate and rebuilds `.next` five times, leaving the LAST (download-configured) build behind. Anything served afterwards renders a state the real site is not in — that is how the OG card came to read "Download OneCommit" while the header read "Request Beta Access". Running the gate's individual tests out of order reproduces it too.
- **Browser cache.** Chrome served a cached document after a rebuild, so a measurement reported `672px` for a box whose source said `38rem` (608px). The source, the build and the server were all correct; only the tab was behind.
- **Smooth scroll.** `html { scroll-behavior: smooth }` is set globally, so a programmatic `window.scrollTo(0, y)` animates. A capture on a fixed timer lands mid-flight: a request for the top of the hero returned a frame ~800px down the page.
- **A wedged headless browser (added 2026-09-24).** After several `Emulation.setDeviceMetricsOverride` cycles, headless Chrome stopped advancing: `Page.captureScreenshot` returned a byte-identical PNG of a build two edits old, and the next CDP client hung forever on `Page.navigate`. Two clients driving the same target at once makes it certain. The tell is a hash collision — two captures of pages that must differ coming back with the same `shasum`.
- **A blank frame from the desktop browser pane (added 2026-09-24).** `mcp__Claude_Browser__computer {action:"screenshot"}` returned an all-canvas image while the same tab's JS reported the target heading at `top:234, width:476, opacity:1` with no transform on any ancestor. The DOM was painted; the capture was not. It happened most often when the screenshot followed a `navigate` in the same `browser_batch`.

## Approach
1. Trust the served bytes over the source. Ask the page what it actually loaded — `document.styleSheets.map(s => s.href)` — and compare against `ls .next/static/css/`. A hash the build directory does not contain proves the server is stale.
2. Put the rebuild inside the serve script, not in the operator's memory: `pnpm build` then `next start`, every time.
3. `Network.setCacheDisabled {cacheDisabled: true}` on every CDP session that measures or captures.
4. `window.scrollTo({top, behavior: "instant"})` for every programmatic scroll, and assert the element is where you asked before capturing.
5. Never run two CDP clients against one target. Kill the previous one by name (`pkill -f "node shot-at.mjs"`) before starting the next.
6. Keep a `rechrome.sh` that kills the headless browser and relaunches it on a fresh `--user-data-dir`, and run it between captures once anything has hung. Relaunching is seconds; a wedged browser costs an hour.
7. Measure in JS first, capture second. `getBoundingClientRect`, `getComputedStyle` and `naturalWidth` come from the live layout and cannot return a stale frame. A screenshot corroborates a measurement; it does not establish one.

## Dead ends
- Re-running the same capture to "confirm" a finding: all three failure modes are perfectly reproducible, so a second identical result reads as corroboration when it is the same lie told twice.
- Raising CSS specificity to force a change through — there was nothing to force; the browser had never seen the file.
- Chasing a "lazy-loading" explanation for images that rendered blank in a headless capture. The same images reported `complete:true, naturalWidth:345` in the pane's JS at the same scroll position. The harness was wedged; the images were fine.
- Re-taking the pane screenshot on its own, then with longer settles, then after a stepped scroll. All three returned the same blank frame, which again reads as corroboration and is not.

## Reusable rule
A screenshot is evidence about a *served build in a particular tab at a moment the harness chose*, not about your source. Before believing one, pin all three: rebuild inside the serve step, disable the cache in the session, and make every scroll instant. When a visual finding contradicts what the source plainly says, suspect the harness before the code — and check the stylesheet hash first, because it settles it in one query. When a capture comes back blank or byte-identical to an older one, do not interpret it at all: restart the browser and re-measure in JS.

## Verification
Two captures of the feature band, before and after a 400px-to-375px crop change, returned the same `shasum` (`f92327...`) while the served HTML plainly carried `height="375"` — that hash collision is what proved the browser was wedged rather than the change being a no-op; a fresh browser produced a different hash immediately. The stale-build case was settled by `document.styleSheets` returning `5e38838cbd8f4fbb.css`, a hash absent from `.next/static/css/`. Cache and scroll were each settled by a single measurement flipping to the expected value after the one-line fix (672→608px; a hero crop moving from y≈800 to y=0). Related: [[2026-09-15-a-killed-pnpm-wrapper-leaves-the-real-server-listening]] and [[2026-09-13-dev-server-500-after-a-production-build-shares-next]].
