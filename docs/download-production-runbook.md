# Download production runbook

Use this when `pnpm smoke:production` fails the app-download checks.

## Required production config

Set at least one of these public variables in Vercel before deploying:

- `NEXT_PUBLIC_APP_DOWNLOAD_URL`
- `NEXT_PUBLIC_IOS_DOWNLOAD_URL`
- `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL`

Allowed destinations include App Store, TestFlight, Google Play, Branch/App Link, OneLink, or an owned `*.onecommit.us` deep-link domain. The URL must not point back to `onecommit.us`, must not contain copied placeholder fragments, and must not use the unrelated App Store listing `id6759487696`.

Concrete store-link checks:

- TestFlight links must use a public `testflight.apple.com/join/...` code.
- App Store links must point to a numeric app id page.
- Google Play links must use `/store/apps/details?id=...` with a real package id.

## Verify locally

```bash
pnpm env:check -- --env-file=.env.local
pnpm lint
pnpm typecheck
pnpm build
```

## Verify production

```bash
pnpm smoke:production
```

To run the same smoke against a local dev server, pass `--skip-apex`:

```bash
pnpm smoke:production -- --base=http://127.0.0.1:3010 --canonical-origin=https://www.onecommit.us --skip-apex
```

The production smoke confirms:

- Apex `https://onecommit.us` redirects to `https://www.onecommit.us`.
- `/`, `/demo`, `/download`, `/support`, `/privacy`, `/terms`, media assets, robots, sitemap, and Open Graph image return non-empty 200 responses.
- `/waitlist` redirects to `/download`.
- The sitemap advertises `/download` and no longer advertises `/waitlist`.
- Public pages no longer contain waitlist-era CTA fragments or Supabase config.
- At least one allowed HTTPS download URL is present on `/`, `/demo`, or `/download`.
- The download URL host resolves in DNS.

## Common failures

- `No external app download URL found`: set a real `NEXT_PUBLIC_*DOWNLOAD_URL` value in Vercel and redeploy.
- `download CTA href still contains a placeholder`: replace copied sample text with the real TestFlight/App Store/Play/deep-link URL.
- `Download CTA points to a blocked URL`: replace the unrelated App Store listing with the actual OneCommit recruiting app or TestFlight link.
- `App download host did not resolve`: fix the deep-link host or use the canonical App Store/TestFlight/Play URL.
- `Legacy waitlist route did not redirect`: redeploy the latest website code or verify the route cache was invalidated.
