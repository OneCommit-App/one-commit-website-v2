# Production Rendering Audit

Last checked: 2026-07-07 00:44 ET  
Auditor: Codex  
Target: `https://www.onecommit.us`

## Result

Current production does **not** reproduce the raw/unstyled HTML failure. The live `www` site returns styled Next HTML, the referenced `/_next/static` CSS and JS assets return the correct MIME types, and a real browser computed the hero styles as applied.

No local website code/config change was made for this audit. The remaining production smoke failure is the expected release blocker: no real external TestFlight/App Store/Play/deep-link download URL is configured. Do not set a fake URL.

## Network Checks

### Host and Redirects

| URL | Result |
| --- | --- |
| `https://www.onecommit.us/` | `200`, `content-type: text/html; charset=utf-8`, `server: Vercel`, `x-vercel-cache: HIT`, `x-matched-path: /`, `content-length: 103578` |
| `https://onecommit.us/` | `307` to `https://www.onecommit.us/`, then `200` |
| `http://www.onecommit.us/` | `308` to `https://www.onecommit.us/`, then `200` |
| `http://onecommit.us/` | `308` to `https://onecommit.us/`, then `307` to `https://www.onecommit.us/`, then `200` |

DNS observed:

- `www.onecommit.us` CNAMEs to `4757a6f50cedf7ad.vercel-dns-017.com`.
- Apex `onecommit.us` resolves to Vercel A records `64.29.17.65` and `216.198.79.65`.

### HTML Shape

Browser-style fetch of `https://www.onecommit.us/`:

- Status: `200`
- HTML bytes: `103578`
- Doctype present: yes
- Next flight/app payload present: yes
- Stylesheet links: `2`
- Script tags: `20`
- Title: `OneCommit — Personalized Track & Field Recruiting`

### Static Asset MIME

The HTML referenced 13 static/font assets. Checked assets returned expected content types:

| Asset class | Example | Status | Content-Type |
| --- | --- | --- | --- |
| CSS | `/_next/static/css/dc45582015d4db6b.css` | `200`/range `206` | `text/css; charset=utf-8` |
| CSS | `/_next/static/css/e01f79ede6e5d22c.css` | range `206` | `text/css; charset=utf-8` |
| JS chunk | `/_next/static/chunks/app/page-872685c791e33436.js` | `200`/range `206` | `application/javascript; charset=utf-8` |
| JS runtime | `/_next/static/chunks/webpack-09756eed3285b046.js` | range `206` | `application/javascript; charset=utf-8` |
| Font | `/_next/static/media/13971731025ec697-s.p.woff2` | range `206` | `font/woff2` |

No checked CSS or JS asset returned `text/html`, `404`, or a redirect loop. Direct apex static asset requests redirect to the matching `www` asset path and then return the same correct content type.

### CSP / MIME

- Current responses did not include a `Content-Security-Policy` header, so CSP is not blocking CSS/JS on the live site.
- Current checked static assets return correct CSS/JS/font MIME types.
- `X-Content-Type-Options` was not present in the checked responses. That is a security-hardening follow-up, not the cause of the raw HTML symptom because MIME is already correct.

## Browser Render Check

Using the in-app browser against `https://www.onecommit.us/`:

- Final URL: `https://www.onecommit.us/`
- Document ready state: `complete`
- Browser console warnings/errors captured: none
- H1 text: `Personalized track recruiting without the guesswork`
- H1 computed font size: `72px`
- H1 computed font family: `"DM Sans", "DM Sans Fallback", ui-sans-serif, system-ui, -apple-system, "system-ui", sans-serif`
- H1 color: `rgb(255, 255, 255)`
- Body background: `rgb(15, 26, 20)`
- Next static script tags in DOM: `9`

Those computed values are inconsistent with raw unstyled browser defaults, so CSS is applying in the current production render.

## Production Smoke

Command:

```bash
pnpm smoke:production
```

Observed:

- Passed apex redirect check.
- Passed public route checks for `/`, `/demo`, `/download`, `/support`, `/privacy`, `/terms`.
- Passed media/artifact checks for `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/demo.mp4`, `/demo-poster.png`, and `/logo.png`.
- Passed `/waitlist` legacy redirect to `/download`.
- Passed canonical robots/sitemap host checks.
- Passed no-public-waitlist-copy check.
- Failed expected download gate:

```text
release smoke failed: No external app download URL found on production pages
```

This is still the correct blocker until a real TestFlight/App Store/Play/deep-link URL exists.

## Likely Root Cause

Current production does not show a code/config-level rendering bug. The most likely explanation for Hugh's raw HTML report is a transient or stale deployment/cache state where the browser received HTML before matching `/_next/static` CSS chunks were available, or a stale browser/service/cache view after a deploy. The current Vercel deployment serves matching Next static assets with correct content types from both canonical and apex paths.

If Hugh can still reproduce raw HTML in a specific browser, the failure is likely client-cache, edge-cache, or deployment-alias specific rather than this local repo configuration.

## Remediation If Raw HTML Reappears

1. Re-run the current checks from the failing network/browser:

```bash
curl -sSIL https://www.onecommit.us/
curl -sSIL https://www.onecommit.us/_next/static/css/dc45582015d4db6b.css
curl -sSIL https://www.onecommit.us/_next/static/chunks/app/page-872685c791e33436.js
pnpm smoke:production
```

2. In browser DevTools on the failing machine, check Network for CSS/JS requests returning `404`, `text/html`, `(blocked:csp)`, or an old deployment hash.
3. In Vercel, confirm `onecommit.us` and `www.onecommit.us` are assigned to the same website project and that `www` is the canonical production alias.
4. Trigger a redeploy of the latest intended website commit and wait for production readiness. Do not change download URL env vars unless the value is a real app/TestFlight/Play/deep-link URL.
5. After redeploy, repeat the asset MIME checks and `pnpm smoke:production`. Treat the download URL failure as expected until the real URL exists.
6. Optional hardening after the release blocker is cleared: add explicit security headers, including `X-Content-Type-Options: nosniff`, and if a CSP is introduced, allow same-origin `style-src`, `script-src`, and `font-src` for Next static assets.
