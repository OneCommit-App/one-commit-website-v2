# pnpm overrides keep a vulnerable transitive pinned even after the parent's range excludes it

**Date:** 2026-09-13
**Lane:** website dependency advisories (next 15.5.21 -> 15.5.25, sharp 0.35.0 -> 0.35.4)

## What happened
`pnpm audit --prod` on main reported two critical Next.js RCE advisories
(GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, patched >=15.5.24) and one high sharp
advisory (GHSA-rgj7-g3m4-5g8c, patched >=0.35.4). sharp is not a direct dependency;
it is an optional dependency of `next`.

The obvious move, bumping `next` to 15.5.25, would have fixed the two Next advisories
but left sharp red. next@15.5.25 declares `sharp: ^0.34.3 || ^0.35.4`, which excludes
0.35.0, yet the repo's `pnpm-workspace.yaml` `overrides:` block pinned `sharp: 0.35.0`
(added 2026-09-01 by the release train). A pnpm override bypasses the dependent's
range entirely, so the lockfile would still resolve sharp@0.35.0.

## The rule
When an advisory names a transitive package, grep `pnpm-workspace.yaml` (pnpm 10)
and the `overrides:` header at the top of `pnpm-lock.yaml` before bumping the parent.
An exact-pin override is the actual resolution authority for that package; the parent's
semver range is decorative until the override moves.

Also: `eslint-config-next` pins `@next/eslint-plugin-next` to its own exact version,
and this repo pins `next` and `eslint-config-next` identically, so they move in lockstep.

## Verification shape that worked
Baseline `pnpm install --frozen-lockfile` + `pnpm audit --prod` first (record the exit),
then bump, then `pnpm install` (non-frozen) once, then the full release-workflow gate list
in `.github/workflows/website-release.yml` order with `download-states.test.mjs` last
(it rebuilds `.next` five times). Read the moved-package list out of
`git diff -- pnpm-lock.yaml`; anything beyond the named packages is a signal to stop.
