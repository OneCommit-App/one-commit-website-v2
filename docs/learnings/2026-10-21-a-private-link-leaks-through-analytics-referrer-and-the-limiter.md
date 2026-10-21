# A private link's code leaks through analytics, the referrer and a server-side proxy, not through your own logs

## Problem
`/p/<code>` (the parent pay page) carries a single-use code in its path. "Don't log the code" sounds like a logging rule, but the page itself never logs anything; the code escapes through three channels the page author doesn't write: the site-wide analytics pageview, the `Referer` sent to Stripe and the API, and (if the API call is proxied server-side) the API's per-IP limiter collapsing onto the website's IP.

## Context that mattered
- `app/layout.tsx` mounts Vercel Web Analytics on every route; its pageview and custom events carry the full URL.
- `next.config.mjs` set `Referrer-Policy: strict-origin-when-cross-origin` site-wide. Same-origin navigations from `/p/<code>` would hand the full path to the next page's `document.referrer`.
- The API (one-commit-api, lane B5) limits the parent-page endpoints at 30/min **per IP** behind Railway (`trust proxy 1`). A Next route handler calling it would make every parent share the site server's bucket.
- The API takes the code in the JSON body on purpose (request/edge logs keep paths). Vercel's own request log still records `/p/<code>`; nothing in the repo can change that.

## Approach
1. List every party that sees a URL from this page: analytics, Stripe (navigation), the API (fetch), the next page on our site, link previews, Vercel's request log.
2. Analytics: wrap `<Analytics>` in a client component with `beforeSend` that rewrites any `/p/...` URL to `/p/[code]` and drops query/hash (`components/site-analytics.tsx`, `redactAnalyticsUrl` in `lib/parent-pay.ts`). A server component can't pass a function prop, hence the wrapper.
3. Referrer: add a `/p/:path*` header entry with `Referrer-Policy: no-referrer` and `X-Robots-Tag` **after** the site-wide `/:path*` entry: Next applies the last matching value for a key. Repeat it as `metadata.referrer`, and set `referrerPolicy: "no-referrer"` + `credentials: "omit"` on the fetches.
4. Leave the page with plain `<a>` (full navigation, fresh document, empty referrer), not `next/link`; one `eslint-disable-next-line @next/next/no-html-link-for-pages` on the `/` link.
5. Keep API calls in the browser. Read `ONECOMMIT_API_BASE_URL`/`ONECOMMIT_API_KEY` at request time (`dynamic = "force-dynamic"`) and pass them as props; the key is the app's client key, visible by design.
6. Link preview: page-level `openGraph` with no `url`, `alternates: { canonical: null }`, no name (the server never looks the athlete up).

## Dead ends
- Putting the referrer entry first in `headers()`: the site-wide entry later in the array would win for `Referrer-Policy`.
- A Next route handler proxy "to hide the API key": the key ships in the app binary anyway, and the proxy turns a per-parent limit into a site-wide one (the API doc says so).

## Reusable rule
When a page's URL is itself a secret, enumerate every receiver of that URL (analytics, Referer, link previews, proxies, edge logs) and close each one at its own layer before writing any UI; "we don't log it" covers none of them.

## Verification
`node scripts/parent-pay-page.test.mjs`: SSR asserts `referrer-policy: no-referrer`, `x-robots-tag: noindex...`, `cache-control` no-store on `/p/*` and the unchanged policy on `/`; the browser flow asserts the API and the Stripe navigation received no `Referer`. `node --test scripts/parent-pay.test.mjs` covers `redactAnalyticsUrl`. Related: [[2026-10-21-cdp-e2e-against-a-mock-api-with-no-new-dependency]].
