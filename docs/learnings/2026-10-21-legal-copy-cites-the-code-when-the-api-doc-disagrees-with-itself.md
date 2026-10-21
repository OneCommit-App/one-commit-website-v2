# Legal copy cites the code, because the API doc can disagree with itself

## Problem
Terms, Privacy, Support and Parents had to describe the Recruiting Pass (price, end date, refunds, the rule for a payment that lands after the athlete commits) before the pass ships. The source of truth named in the brief was the API's `docs/apple-iap.md` on `fable/recruiting-pass-api`. That doc states the post-commit rule two ways: its webhook section says a payment that lands after a commitment is recorded `committed` and refunded automatically; its "Known limits" paragraph, written earlier, says such a payment "is honoured (the grant does not re-check the commitment)" and support refunds it by hand.

## Context that mattered
- The site and the API are separate repos, and the API branch was not deployed, so nothing on the site could test the rule.
- A later migration (`20261021120000-recruiting-passes-committed-refund.js`) added the `committed` revocation reason; the "Known limits" sentence predates it.
- Refund windows already disagreed across pages (Terms and Support said 7 days; the API doc says web refunds inside 14 days).

## Approach
1. For every sentence of copy, find the line of code that makes it true, not the doc paragraph. The commitment rule is `applyStripeParentPass` in `RecruitingPass.service.js` (a grant-time `findCommittedMatch`, revoked as `committed`) and `grantFromSession` in `ParentPay.service.js` (refunds `duplicate` or `committed` in full).
2. Look for the absence too: no code path revokes or refunds a pass when the athlete commits AFTER it was granted (every revocation caller is a Stripe refund, dispute or duplicate event), so the Terms can say a later commitment does not end the pass.
3. Where the code has no answer (the 14-day web refund window is a manual Stripe refund, not code), write the doc's number and flag it as the owner's decision.
4. Pin the agreed words in a test (`scripts/pass-copy.test.mjs`): one price, one refund window, no page still saying there is no paid plan, and no gendered pronouns. It ran red on the pre-change pages and green after.

## Reusable rule
When copy makes a promise about money, cite the function that keeps it. A design doc can hold two versions of the same rule written a day apart; the code holds one.

## Verification
`node --test scripts/pass-copy.test.mjs`: 1/4 pass on `fable/parent-pay-page` 4610300's pages (red), 4/4 after. The stale "Known limits" sentence is reported back to the API lane.
