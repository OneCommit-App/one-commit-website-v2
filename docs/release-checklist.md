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
