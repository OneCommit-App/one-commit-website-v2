# S4 security headers — October 28, 2026

Base: `df915cb41ad1484ff06c1405a4d4803cc3970b43`. Local production build, Node 24.19.0 / pnpm 10.18.3 / Next 15.5.27. No deployment or production request.

## Change

Adds one-year HSTS with `includeSubDomains` and a full **Content-Security-Policy-Report-Only** resource policy. Existing enforced `frame-ancestors 'none'; base-uri 'self'; object-src 'none'`, X-Frame-Options DENY, nosniff, strict-origin-when-cross-origin referrer policy, and disabled camera/location/microphone are preserved.

The observation policy allows same-origin resources, inline Next bootstrap scripts/styles, HTTPS images, local fonts/media, hosted Supabase project HTTPS endpoints, and Vercel Analytics script/collection origins. Current main has no Supabase client or URL; `/waitlist` is a redirect to `/download`. The Supabase wildcard is compatibility for hosted project URLs, not evidence of an active integration. Custom-domain Supabase URLs require an explicit policy change if introduced.

No report collector is configured: browser console and `securitypolicyviolation` events are the initial observation surface. No private page URLs are transmitted to a new reporting service. Before promoting this policy to enforcement, tighten project-specific origins, decide on a report collector, and resolve inline-script/style allowances with the rendering owner. HSTS is honored over HTTPS; these local HTTP checks verify delivery only. No preload enrollment is requested.

## Verified

- `pnpm typecheck`: pass.
- `pnpm build`: pass, complete 16-page generation and route table. Next's built-in build checks ran; `pnpm lint` was never invoked.
- Updated existing `scripts/security-headers.test.mjs`: verifies exact intended policy and universal route coverage.
- `pnpm check:headers`: five routes passed, including the original 307 response from `/waitlist`. [Full output](evidence/security-headers-1028.txt).
- Local Chromium at 390×844: `/waitlist` → `/download`, title `Request Beta Access | OneCommit`; **zero CSP violation events, zero console/page errors, zero write requests**. Every browser mutation and external request was blocked. [JSON evidence](evidence/waitlist-csp-1028.json), [screenshot](evidence/waitlist-headers-1028.png). No form was submitted. Local non-Vercel rendering does not load Analytics; allowlist inspection is not proof of production ingestion.

Run after building: `pnpm start --hostname 127.0.0.1 --port 3104`, then `pnpm check:headers`. A different loopback base may be passed as the argument. This is a securityheaders-style self-check, not a securityheaders.com grade or a public-site scan.

## Production dependency audit remains red

`pnpm audit --prod` exited 1: **3 advisories, 1 critical and 2 high**. These are inherited from the unchanged main dependency graph. No claim is made that headers fix package vulnerabilities, and exploitability was not tested.

| Dependency | Registry finding | Reported fixed version |
|---|---|---|
| Next 15.5.27 | [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw), critical, image optimization SVG RCE | 15.5.28 |
| Next 15.5.27 | [GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r), high, App Router Server Actions DoS | 15.5.28 |
| Zod 3.25.67 | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), high, oversized constrained collections | 4.6.6 |

Registry findings and GitHub advisories read October 28. Claude owns dependency remediation/integration; Zod crosses a major version and needs a separate compatibility review. This PR changes headers and checks only. It is not a green security-release verdict.
