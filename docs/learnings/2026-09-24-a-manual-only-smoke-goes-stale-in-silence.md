# A smoke that only runs on workflow_dispatch rots without ever going red

## Problem
`scripts/smoke-production.mjs` required the fragment `"d3-focused onescore"` on `/coaches`, `/schools` and `/athletic-programs`. PR #39 moved the D3 qualifier off the product and onto the dataset — the pages now read "OneScore guidance across the current D3 beta dataset" — and the pin was never updated. The smoke had been failing for six merged PRs and nobody knew, because it only runs on `workflow_dispatch`.

## Context that mattered
- `.github/workflows/website-release.yml` gates `production-smoke` behind `if: github.event_name == 'workflow_dispatch'`. On every PR it reports `skipping`, which reads like a pass in `gh pr checks`.
- The smoke stops at the **first** failure, so one stale pin hides every check below it. The known, intended hold — no `NEXT_PUBLIC_APP_DOWNLOAD_URL` — sits at the very bottom and was never being reached.
- The three audience pages word the surrounding sentence differently from each other, so the naive repin (`"current d3 beta dataset"`) passed two of them and failed `/athletic-programs`.

## Approach
1. When a required-fragment assertion fails, first ask whether the fragment ever existed: `git log -S "<fragment>"` names the PR that removed it.
2. Repin to the assertion's *purpose*, not its old wording. Here the job is "these pages still name the dataset scope rather than implying equal division coverage", so the pin became the two words all three pages share.
3. Leave a comment on the pin naming the PR that moved the copy, so the next person does not revert it.
4. Re-run to the end and confirm the run now stops only at the intended hold.

## Dead ends
- Reading `skipping` in `gh pr checks` as "nothing to see". A skipped job carries no information about the thing it would have checked.
- Repinning to the longest phrase that matched the page I happened to open. Two of three pages passed, which looked like success.

## Reusable rule
Any check that does not run on every merge must be run by hand before you claim it passes — and a claim that it passed expires the moment anything it asserts on is edited. When a smoke is manual-only, re-run it at the end of every session that touched the copy it pins.

## Verification
`node scripts/smoke-production.mjs --base=https://www.onecommit.us` now passes all 15 routes plus redirect, canonical, campaign, public-copy, marketing-claims, audience-semantics and no-download-fallback, and fails only at `No external app download URL found on production pages`. Related: [[2026-09-16-three-ways-a-screenshot-lies]].
