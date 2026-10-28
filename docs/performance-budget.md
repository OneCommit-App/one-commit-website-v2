# Local performance budget

Run with the repository Node 24 and pnpm 10.18.3 versions:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test:lh
pnpm lh
```

Chrome must be installed. Set `CHROME_PATH` if chrome-launcher cannot find it. The command owns a loopback `next start` server on an available port and a fresh headless Chrome per route/profile, and closes them afterward. External HTTPS requests are blocked and browser DNS is limited to loopback. Never point this harness at production.

It discovers all sitemap routes plus static `app/**/page.*` routes, including `/waitlist` (which redirects to `/download`). Dynamic routes require explicit fixture support before they can be measured. Defaults cover all routes with mobile and desktop Lighthouse presets. `LH_ROUTES=/,/about` and `LH_MODES=mobile` are optional diagnostic subsets; their summary explicitly marks partial coverage. Empty, duplicate and unknown selections are errors.

Reports go to gitignored `.lighthouse/`: per-route/profile JSON and HTML, `partial.json` during a run, `summary.json`, `summary.md`, and server output. A new invocation invalidates prior summary markers without deleting individual diagnostic reports. The new summary alone identifies the current run's coverage; leftover individual report files are not current-run proof.

Budgets are report-only: mobile LCP **<2.5 seconds**, CLS **<0.1**, and transferred JavaScript **<=250 KiB per navigation** on both profiles. The JS ceiling is an initial project decision. Budget misses retain exit 0; missing/invalid scores, runtime errors, individual audit errors, missing metrics and process failures exit nonzero. Warnings remain visible. Tests cover boundaries, invalid reports, duplicate/partial coverage and safe stale-summary invalidation.

## October 28 baseline

[Full results and ranked asset proposals](evidence/performance-baseline-1028.md) and [machine-readable results](evidence/performance-baseline-1028.json) cover all 11 routes and both profiles on main `df915cb41ad1484ff06c1405a4d4803cc3970b43`, with only engineering tooling added. Single cold runs on this shared machine are not production field measurements.

The homepage scored 89 mobile / 99 desktop. Mobile LCP was 3.60 s (budget miss); all other measured budgets passed. Transfer JS ranged from 185.1 to 198.6 KiB, and CLS was zero. The largest raw asset is `public/app/profile.png` at 1125.6 KiB. The ranked list includes unused archives, so confirm actual network use before prioritizing compression. No image/video was changed; `public/demo.mp4` is absent from this main snapshot.

The original baseline includes a slow-load warning for desktop `/athletic-programs` and cache-clear timeouts for both `/waitlist` profiles. The expected waitlist redirect is disclosed. The [four-run recheck](evidence/performance-recheck-1028.md) passed all budgets with scores of 100 and no timing/cache warnings; only the expected waitlist redirect warnings remain. Its JSON marks coverage as partial. No rerun silently replaces the baseline.

## Verification and publication boundary

The final validator re-read all 22 frozen Lighthouse JSON reports and exactly reproduced their recorded measurements. `pnpm test:lh` passes 9 tests; `pnpm typecheck`, `pnpm build` (16 generated pages), and `git diff --check` pass under Node 24.19.0/pnpm 10.18.3. Existing production dependency advisories remain a separate release blocker.

`vercel.json` disables automatic deployments only for `codex/site-s3-performance-1028`, using [Vercel's documented `git.deploymentEnabled` branch map](https://vercel.com/docs/project-configuration/git-configuration). This is necessary to publish the engineering PR within the no-deploy boundary: prior S1/S2/S4/S6 PR creation triggered the repository's existing automatic previews. Main and every other branch keep their existing behavior. No production configuration or project settings were changed.
