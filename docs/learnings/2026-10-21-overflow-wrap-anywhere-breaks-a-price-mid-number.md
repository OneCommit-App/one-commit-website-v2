# `overflow-wrap: anywhere` breaks a price mid-number: keep atoms whole, and size them to their box with container units

## Problem
The parent pay page put `[overflow-wrap:anywhere]` on its content column so a 40-character first name wraps on a small phone. A reviewer then found the price split as "$149.9" / "9" at 280px wide with Chrome's "Very large" text (24px). The edge check passed, because nothing ran past the screen. The number just broke.

## Context that mattered
- `overflow-wrap: anywhere` is inherited, and unlike `break-word` it also lowers an element's min-content width to about one character. A flex item's automatic minimum size is its min-content width, so the price could shrink below its own width and wrap inside itself.
- The price was `min(2.75rem, 16vw)`. That ties the size to the viewport, but the room it has is the card's content box: viewport minus the page and card padding. Both paddings are in rem, so they grow with the text setting. At 280px/24px that left 172px for a 44.8px price about 176px wide.
- "$149.99" in the system bold font, tabular digits and -0.035em tracking measures 3.88-3.97em wide in headless Chrome on macOS.

## Approach
1. Treat the price as one word: `whitespace-nowrap [overflow-wrap:normal]` on its span, so it can't break whatever the column allows.
2. Size it to the row it sits in, not the viewport: `@container` on the row and `min(2.75rem, 24cqi)`. 24cqi × 3.94em is about 95% of the row, so it always fits with roughly 5% to spare. It is still 44px at the default text size on any phone, as before.
3. Keep `min(2.75rem, 16vw)` as the base and apply the cqi size under `supports-[width:1cqi]:`, so a browser without container units still gets a sensible size. In the built CSS, the `@supports` rule comes after the base rule.
4. The e2e test (`scripts/parent-pay-page.test.mjs`) now gets the price's line boxes from a `Range` (counting distinct rounded `top` values), checks its right edge against the card's content edge, and adds 280px/24px to the size sweep. It also records every state's failure before failing, so one red run lists all of them.

## Dead ends
- A smaller vw factor alone (14vw) can't guarantee a fit: the padding is in rem, so the room left for the price shrinks faster than the viewport as the text grows. At 320px with 48px text the card has 104px of room.
- An edge-of-screen check can't see this. The broken price stays inside the screen, so the test has to check line count and the card's edge.

## Reusable rule
When a container allows breaks anywhere (for long names), mark the atoms that must never break (prices, dates, codes) `nowrap` with `overflow-wrap: normal`. Size big display numbers to their own box with container query units, not to the viewport, because the padding around them grows with the user's text size.

## Verification
Red on 4610300's view: the 280px/24px step fails "the price breaks across 2 lines" in the payable, guardian-note and long-name states (font=44.8px, width=172). Green after. A scratch probe over 15 width and text-size pairs (160-1280px wide, 16-48px text) kept the price on one line inside its card everywhere, with at least 5px of slack. Related: [[2026-10-21-a-clipped-wrapper-hides-large-text-overflow-from-a-scroll-width-check]].
