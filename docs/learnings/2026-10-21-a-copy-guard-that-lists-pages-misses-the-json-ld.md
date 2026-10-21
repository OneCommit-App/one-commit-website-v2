# A copy guard that lists pages misses the JSON-LD: scan the whole source tree, and treat flag-dependent copy as a launch gate

## Problem
`scripts/pass-copy.test.mjs` was written so no page would still say "no paid plan" once the Recruiting Pass copy landed. It read four pages: /parents, /support, /terms and /privacy. A reviewer built the site and found the home page still said "Free during beta" and "no paid plan", the FAQ said "No paid plan ... is active today", and the JSON-LD sent to search engines said `"price":"0"` with "no paid plan is currently active". The guard was green the whole time.

## Context that mattered
- The price is stated in more places than the routes that look like pricing pages: `components/pricing-section.tsx`, the trust strip (`app/page.tsx` and `components/stats-section.tsx`), `components/home/problem-section.tsx`, `components/faq-data.ts`, which is also emitted as FAQPage JSON-LD, and `components/json-ld.tsx`.
- `scripts/smoke-production.mjs` (the manual production smoke) required "free, capacity-limited beta" and "capacity-limited beta invitations" on `/`. It would have failed the first production run after the copy shipped.
- The 14-day web refund in the first draft came from one sentence in an API design doc (docs/apple-iap.md, "Known limits"). No code enforces a window, and no decision sets a new one. The live Terms had a discretionary 7-day review.
- The copy is only true with switches the site can't see: `RECRUITING_PASS_ENABLED` and `IAP_ENFORCEMENT_ENABLED` (the 3-email trial; otherwise the allowance is 1 email), `PARENT_PAY_ENABLED` (otherwise pay links answer 404), the App Store product, and the app's paywall and Ask a parent releases.

## Approach
1. Make the guard walk every `.ts`, `.tsx`, `.md` and `.mdx` file under `app/`, `components/` and `lib/`, and fail with the list of `file: pattern` hits. It also asserts it read more than 50 files, so an empty walk can't pass.
2. Write the stale patterns as claims, not page phrases: "no paid plan", "Free during beta", "free invitation", "price will be shown before", "show our price before", `price: "0"`, "No credit card is required".
3. Collect every "within N days ... and we will review/refund" in any file that mentions refunds, and assert there is exactly one window.
4. Restore the published refund wording (a 7-day discretionary review) until Hugh and counsel decide otherwise. A draft shouldn't turn an engineering note into a promise.
5. Update the production smoke's pins in the same change as the copy.
6. Record the flag dependencies as a launch gate in `docs/release-checklist.md`. A test can keep the words consistent, but it can't tell whether they are true yet.

## Dead ends
- Adding the missing files to the page list would fix today's miss but not the next component that states a price. The walk costs about 15ms.

## Reusable rule
A guard against a contradiction has to read every place the claim can live. For a website that includes structured data and shared data modules, not just routes. When copy is true only under a feature flag, the merge belongs to the release that flips the flag. Write that down where releases are run, because CI can't see the flag.

## Verification
Red on 10fadda: 3 of 5 tests fail. There are 15 stale hits across app/page.tsx, faq-data.ts, json-ld.tsx, pricing-section.tsx, problem-section.tsx and stats-section.tsx; the refund window reads 14 instead of the published 7; and "90 days if that ends later" doesn't say 90 days from when. Green after: 5/5. Related: [[2026-10-21-legal-copy-cites-the-code-when-the-api-doc-disagrees-with-itself]].
