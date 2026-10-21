# Browser e2e for a client-fetching page with no new dependency: runtime env, a mock API and CDP Fetch interception

## Problem
The parent pay page fetches everything client-side from an API that isn't deployed, then redirects to Stripe. SSR smoke tests (the repo's pattern) see only a skeleton, and Playwright would mean a lockfile change and a browser download.

## Context that mattered
- Repo tests are plain `node` scripts that spawn `next start` on a reserved port (`scripts/home-ssr.test.mjs`).
- `NEXT_PUBLIC_*` values are inlined at build time, so a mock API base URL would need its own build.
- Node 24/25 ship a global `WebSocket`; Chrome is installed locally and on `ubuntu-latest`.
- Nothing may reach Stripe or the real API from a test.

## Approach
1. Read the API origin and key from server env at request time and pass them as props (`app/p/[code]/page.tsx`). One build serves any mock: `ONECOMMIT_API_BASE_URL=http://127.0.0.1:<port>` on `next start`.
2. Mock API = `node:http` answering the two POSTs from per-code fixtures (call-count sequences for retry and "paid then covered"), CORS like the API's `cors()`, recording method/url/headers/body.
3. Launch Chrome `--headless=new --remote-debugging-port=0 --user-data-dir=<tmp>`, read `DevTools listening on ws://...` from stderr, `Target.createTarget` + `attachToTarget {flatten:true}`.
4. `Fetch.enable {patterns:[{urlPattern:"*"}]}`: continue 127.0.0.1, fulfil `checkout.stripe.com` with a stub page, fail and record everything else; assert the record is empty at the end.
5. Drive with `Runtime.evaluate` (clicks, `innerText`, `location.href`), polling instead of sleeping; `Emulation.setDeviceMetricsOverride` / `setEmulatedMedia` for 320/390/1280 and dark.
6. Without Chrome, run the SSR half and print SKIP; under `CI`, fail instead.

## Dead ends
- Counting every paused request to `checkout.stripe.com` as "the redirect": the stub page also asks for `/favicon.ico`, so the count was 2. Filter on `resourceType === "Document"`.

## Reusable rule
When a page fetches from the browser, pass the API origin as a request-time server prop (not `NEXT_PUBLIC_`), so one build can be pointed at a mock, and intercept every browser request with CDP `Fetch` so the test proves nothing left the machine.

## Verification
`PARENT_PAY_SHOTS=<dir> node scripts/parent-pay-page.test.mjs` → 12 `ok` steps plus `ok nothing left this machine`, ten PNGs. Related: [[2026-09-16-three-ways-a-screenshot-lies]], [[2026-10-21-a-private-link-leaks-through-analytics-referrer-and-the-limiter]].
