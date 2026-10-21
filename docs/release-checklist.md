# Website release checklist

This checklist is for release readiness only. Do not commit real `.env*` files, app-store credentials, or deployment secrets.

## Environment variables

Required for production launch:

- Set at least one public app-download URL:
  - `NEXT_PUBLIC_APP_DOWNLOAD_URL`
  - `NEXT_PUBLIC_IOS_DOWNLOAD_URL`
  - `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL`
- Optional App Store smart-banner support:
  - `NEXT_PUBLIC_APP_STORE_ID`

Use a real App Store, TestFlight, Google Play, Branch/App Link, OneLink, or owned `*.onecommit.us` deep-link URL. Do not use copied placeholder links or the unrelated App Store listing `id6759487696`; that is a different OneCommit habit app.

Before building or redeploying a configured environment, validate the public download settings:

```bash
pnpm env:check
```

To check a local env file without exporting variables first:

```bash
pnpm env:check -- --env-file=.env.local
```

## Parent pay page (`/p/<code>`)

The page a parent opens from the athlete's "text a parent" link. It calls the API's
`/v1/parent-pay/links/lookup` and `/checkout` from the browser and sends the parent
to Stripe Checkout. Before the API's `PARENT_PAY_ENABLED` goes on:

- [ ] `ONECOMMIT_API_KEY` set on the host: the API's `x-api-key`, the client key the app
      already ships. It reaches the browser, so it must never be a server secret. Unset,
      the page answers "This page didn't load."
- [ ] `ONECOMMIT_API_BASE_URL` left empty (production API) or set to a staging API.
- [ ] The Recruiting Pass copy ships in the same release (see "Recruiting Pass copy: launch gate" below).
- [ ] Stripe email receipts on (successful payments and refunds): the thank-you page says
      "Stripe emails your receipt", and a receipt is the parent's only record.
- [ ] Only `https://checkout.stripe.com` addresses are followed. A Stripe custom checkout
      domain needs `CHECKOUT_HOSTS` in `lib/parent-pay.ts` first.

## Recruiting Pass copy: launch gate

`/terms` section 7, `/privacy` ("Payments and Parent Pay Links"), `/support`, `/parents`, the home
pricing section, the trust strip, the FAQ and the JSON-LD describe the pass as on sale today, at
$149.99 once, with the first 3 coach emails free. Each of those is true only once the items below
are done, so this copy merges and deploys in the same release as all of them, never on its own
schedule. `scripts/pass-copy.test.mjs` keeps the words consistent; it cannot see these switches.

- [ ] Hugh and counsel have read `/terms` section 7, the privacy section, and the refund wording.
      The web refund rule is still the published 7-day discretionary review; a different window
      or an unconditional refund is their call (change `/terms`, `/support` and the test together).
- [ ] API: `RECRUITING_PASS_ENABLED` and `IAP_ENFORCEMENT_ENABLED` both on. Only then is the free
      allowance the pass trial: 3 coach emails, then the paywall (`src/routes/SubscriptionRoutes.js`).
      With `RECRUITING_PASS_ENABLED` off it is 1 email (`freeEmailLimit` in `src/config/limits.js`),
      and `FREE_EMAIL_LIMIT`, if set, overrides either default.
- [ ] API: `PARENT_PAY_ENABLED` on. It needs `RECRUITING_PASS_ENABLED` too; otherwise every pay
      link answers 404 `parent_pay_disabled`.
- [ ] App Store Connect: `us.onecommit.app.recruiting_pass` live at $149.99 (Hugh).
- [ ] App: the pass paywall (A2) and Ask a parent (A3) released, so "buy it in the app" and
      "text a parent a link" are true.
- [ ] Stripe: email receipts on; the Stripe Tax decision made ("Taxes may apply").
- [ ] "Last updated" on `/privacy` and `/terms`, the sitemap dates, and the
      `scripts/privacy-disclosures.test.mjs` pins set to the publish day.

## Demo media

- [x] Compressed `public/demo.mp4` from 15 MB to 2.1 MB for the production landing page.
- [x] Keep `public/demo.vtt` present for the full demo page captions.

## Local verification

Run before handing off for staging:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm audit --prod
pnpm build
node --test scripts/parent-pay.test.mjs
node scripts/parent-pay-page.test.mjs
```

Use Node `24.x` per `package.json`; verify with `node -v` before running release checks.

## Staging and commit readiness

- [ ] Set the required download URL env var in the staging host.
- [ ] Open the staging homepage, `/demo`, `/download`, `/support`, `/privacy`, and `/terms`.
- [ ] Confirm every primary CTA opens the intended app download destination.
- [ ] Confirm `/waitlist` redirects to `/download`.
- [x] Confirm `public/demo.mp4` is production-sized for staging smoke.
- [ ] Re-run local verification on a clean checkout before merging.

## Production smoke

Run the non-mutating production smoke before launch handoff:

```bash
pnpm smoke:production
```

The smoke checks the apex redirect, public routes, media assets, `/waitlist` legacy redirect, canonical sitemap artifacts, absence of waitlist-era public copy, and whether deployed `/`, `/demo`, and `/download` expose at least one concrete, non-placeholder HTTPS app-download URL whose host resolves.

You can also run the same production smoke from GitHub Actions by manually dispatching the `Website Release Gates` workflow. The manual path runs the local release gates first, then smokes the live site with `base_url=https://www.onecommit.us` and `apex_url=https://onecommit.us` by default.

Current blocker, verified 2026-07-06: production is deployed with the download-first website, but Vercel does not yet have a real external app-download URL configured. After setting the real app download URL in Vercel and redeploying, rerun `pnpm smoke:production`.
