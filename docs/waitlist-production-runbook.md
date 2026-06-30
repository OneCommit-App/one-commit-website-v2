# Waitlist production runbook

Use this when `pnpm smoke:production` reaches the waitlist checks and fails on Supabase DNS, auth, RLS, or duplicate handling.

## DNS blocker signature

If production route and media checks pass but the waitlist smoke fails with DNS resolution, the output looks like:

```text
release smoke failed: Supabase project host did not resolve
hostname: <project-ref>.supabase.co
code: ENOTFOUND
```

That means the deployed client bundle contains a Supabase project URL, but the project hostname does not resolve publicly. The likely fixes are to correct the Vercel production environment variables, restore the Supabase project, or point production at the intended active project. The 2026-06-29 production failure is tracked in issue #10: https://github.com/OneCommit-App/one-commit-website-v2/issues/10

## Required production values

Set these in the Vercel production environment for the website project:

- `NEXT_PUBLIC_SUPABASE_URL`: the active project URL, for example `https://<project-ref>.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the public anon key for that same project

Use only the anon key in this app. Never set or expose a Supabase service-role key in `NEXT_PUBLIC_*` variables.

Validate the values before redeploying:

```bash
pnpm env:check
```

or, when checking a local env file:

```bash
pnpm env:check -- --env-file=.env.local
```

Then verify the target Supabase project is reachable with the public key:

```bash
pnpm waitlist:check
```

For local env-file verification:

```bash
pnpm waitlist:check -- --env-file=.env.local
```

## Supabase setup

1. Open the target Supabase project and confirm its project URL matches `NEXT_PUBLIC_SUPABASE_URL`.
2. Verify the checked-in migration still matches the browser waitlist payload and least-privilege policy contract:

```bash
pnpm waitlist:migration:check
```

3. Apply `supabase/migrations/20260629000000_create_waitlist.sql`.
4. Confirm `public.waitlist` exists.
5. Confirm row level security is enabled.
6. Confirm the anon role has insert access only.
7. Confirm duplicate emails are rejected by `waitlist_email_unique_idx`.

## Deployment verification

After changing Vercel environment variables, redeploy production. Next.js bundles `NEXT_PUBLIC_*` values at build time, so changing the env vars without a redeploy is not enough.

Run the non-mutating production smoke first:

```bash
pnpm smoke:production
```

Expected result before insert testing:

- Apex `https://onecommit.us` redirects to `https://www.onecommit.us`.
- Core routes and media return 200.
- Supabase config is found in the deployed waitlist bundle.
- Supabase project host resolves in DNS.
- Supabase REST gateway accepts the deployed public key.
- Waitlist insert smoke is skipped unless explicitly enabled.

After the test-row policy is approved, run the mutating smoke:

```bash
pnpm smoke:production -- --insert
```

or:

```bash
WAITLIST_SMOKE_INSERT=1 pnpm smoke:production
```

Expected mutating result:

- A generated `codex-smoke-...@example.com` row inserts through the anon key.
- Reusing the same generated email is rejected as a duplicate.

To test the Supabase project directly before a Vercel rebuild, use:

```bash
pnpm waitlist:check -- --insert
```

This runs the same anon insert and duplicate-email rejection checks against the configured Supabase project URL/key instead of the deployed website bundle.

## Failure map

- `No Supabase project URL found`: production env vars were missing at build time or the waitlist bundle did not include the Supabase client path.
- `No Supabase public key found`: `NEXT_PUBLIC_SUPABASE_ANON_KEY` was missing at build time.
- `Supabase project host did not resolve`: the configured project ref is wrong, inactive, deleted, or not publicly resolvable.
- `Supabase REST gateway check failed`: the project host resolves, but the public key is invalid for that project or the REST gateway is unavailable.
- `Waitlist smoke insert failed`: inspect the returned status/body for RLS, key mismatch, missing table, invalid payload, or migration drift.
- `Waitlist duplicate smoke did not reject`: the unique index or duplicate handling is missing or not applied in the active project.
