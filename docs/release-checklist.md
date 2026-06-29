# Website release checklist

This checklist is for release readiness only. Do not commit real `.env*` files, Supabase service-role keys, or deployment credentials.

## Environment variables

Required for local, staging, and production waitlist submissions:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the public anon key only. Never expose a Supabase service-role key in this Next.js app.

Before building or redeploying a configured environment, validate the public Supabase settings:

```bash
pnpm env:check
```

To check a local env file without exporting variables first:

```bash
pnpm env:check -- --env-file=.env.local
```

After the values pass format validation, check the actual Supabase project DNS and REST gateway:

```bash
pnpm waitlist:check
```

To test a local env file:

```bash
pnpm waitlist:check -- --env-file=.env.local
```

## Supabase waitlist checks

Apply the migration in `supabase/migrations/20260629000000_create_waitlist.sql` to the target Supabase project.
For production setup and smoke failure triage, use `docs/waitlist-production-runbook.md`.

The client inserts into the `waitlist` table with these fields:

- `first_name`
- `last_name`
- `email`
- `sport`
- `grad_year`
- `phone`

Before release, confirm in Supabase:

- [ ] `waitlist` exists in the target project.
- [ ] The anon role can insert rows into `waitlist`.
- [ ] Row Level Security is enabled with an insert policy for the anon role.
- [ ] No client-side select/update/delete policies are broader than intended.
- [ ] `email` has the expected uniqueness constraint if duplicate signups should be rejected.
- [ ] `grad_year` is required and accepted only for the currently supported high-school classes: 2027-2030.
- [ ] A staging form submission reaches the table and duplicate submissions show the existing duplicate-email error.

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

- [ ] Set the required Supabase env vars in the staging host.
- [ ] Open the staging homepage, `/demo`, and `/waitlist`.
- [ ] Submit the waitlist form once on staging and verify the Supabase row.
- [ ] Submit the same email again and verify the duplicate handling.
- [x] Confirm `public/demo.mp4` is production-sized for staging smoke.
- [ ] Re-run local verification on a clean checkout before merging.

## Production smoke

Run the non-mutating production smoke before launch handoff:

```bash
pnpm smoke:production
```

The smoke checks the apex redirect, public routes, media assets, and whether the deployed waitlist bundle contains a resolvable Supabase project URL plus a public key.

After the Supabase project and Vercel environment variables are confirmed, run the mutating waitlist smoke with a generated `codex-smoke-...@example.com` address:

```bash
pnpm smoke:production -- --insert
```

The insert smoke verifies anon insert and duplicate-email rejection. Do not run it against production until test-row policy is acceptable.

If you need to verify the Supabase project directly before a Vercel rebuild, run:

```bash
pnpm waitlist:check -- --insert
```

This uses the configured public Supabase URL/key directly and verifies anon insert plus duplicate-email rejection without reading the deployed website bundle.
