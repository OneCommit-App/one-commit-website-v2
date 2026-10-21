# A clipped wrapper hides large-text overflow from a scroll-width check: measure elements and text, under the real text-size setting

## Problem
The parent pay page passed its "no horizontal overflow" check at 320, 390 and 1280px, yet with Chrome's "Very large" text the "once" pill sat past the right edge of a 320px screen, and at a 32px root font "$149.99" ran 23px off a 390px screen. A reviewer found it with a one-off probe.

## Context that mattered
- The page wrapper is `oc-wash ... overflow-x-clip`. `overflow-x: clip` never makes a scroll container, so `document.documentElement.scrollWidth` stays equal to the viewport whatever runs past the edge. The old check (`scrollWidth <= innerWidth`) could not fail.
- Only `rem` sizes follow the user's text size (the price at 2.75rem, the h1, the logo). Body copy is fixed px, so overflow shows up in the big type first.
- The API sends a first name of up to 40 characters with no spaces (`firstNameOf` in the API's ParentPay.service.js), so one long word can be wider than a phone.

## Approach
1. Walk every element under `body` and compare `getBoundingClientRect()` with `documentElement.clientWidth`.
2. Also walk every text node with a `Range`: a long word overflows its block's text, not the block's box, so the element pass alone missed the long-name h1.
3. Set the real text-size setting with CDP `Page.setFontSizes({ fontSizes: { standard: 24, fixed: 20 } })`, and assert `getComputedStyle(html).fontSize` is what you asked for, so a Chrome that ignores the call fails loudly instead of passing at 16px.
4. Run every state (payable, guardian note, long name, covered, unavailable, error, rate limited, paid pending, confirmed, unknown) at 320px/24px, 390px/32px and 240px/16px (about 160% zoom on a phone). Collect all offenders per size before failing, so the red run lists everything.
5. Fix: `flex-wrap` on the price and date rows, the price at `min(2.75rem, 16vw)` (the same 44px at default text on any screen 275px or wider), and `overflow-wrap: anywhere` on the content column for long names.

## Dead ends
- Setting `document.documentElement.style.fontSize` after load works for measuring, but it is not the setting users change and it resets on every navigation.
- `Page.captureScreenshot({ captureBeyondViewport: true })` re-lays the page out at the default text size, so a full-page shot under `Page.setFontSizes` silently shows 16px text. Take large-text shots with `captureBeyondViewport: false`.

## Reusable rule
An overflow check that reads `scrollWidth` proves nothing under an `overflow-x: clip` (or hidden) ancestor. Measure element boxes and text ranges against the viewport, under the browser's own text-size setting, in every state.

## Verification
Red on the old view: 4 failing steps (the three size steps listed "once", "$149.99", and the long name in the h1, the approval line and the guardian label; plus the unknown-state copy). Green on the new view: all steps `ok`. Logs in the lane's scratchpad (`d1/e2e-red-old-2.log`, `d1/e2e-green-new.log`). Related: [[2026-10-21-cdp-e2e-against-a-mock-api-with-no-new-dependency]], [[2026-09-16-three-ways-a-screenshot-lies]].
