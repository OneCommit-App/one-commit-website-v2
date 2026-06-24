# Website release checklist

This branch is for release readiness only. Do not commit real `.env*` files, Supabase service-role keys, or deployment credentials.

## Completed in this branch

- [x] Confirm branch base: `codex/website-release-readiness` at `origin/main` after PR #7.
- [x] Add `.env.example` for the public Supabase browser client variables.
- [x] Keep `.env*` files ignored while explicitly allowing `.env.example` to be tracked.
- [x] Add `pnpm typecheck` for a noninteractive TypeScript verification command.
- [x] Point social metadata at the generated `/opengraph-image` route instead of the missing `/og-default.png` asset.

## Environment variables

Required for local, staging, and production waitlist submissions:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the public anon key only. Never expose a Supabase service-role key in this Next.js app.

## Supabase waitlist checks

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
- [ ] A staging form submission reaches the table and duplicate submissions show the existing duplicate-email error.

## Demo media

- [ ] Compress or replace `public/demo.mp4` before release if the 15 MB asset is too heavy for the production landing page.
- [x] Keep `public/demo.vtt` present for the full demo page captions.

## Local verification

Run before handing off for staging:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

Current note: `pnpm lint` still invokes `next lint`, but this repo does not include an ESLint config or `eslint` dependency yet. Treat lint setup as a separate owner decision before making it a release gate.

## Staging and commit readiness

- [ ] Set the required Supabase env vars in the staging host.
- [ ] Open the staging homepage and `/demo`.
- [ ] Submit the waitlist form once on staging and verify the Supabase row.
- [ ] Submit the same email again and verify the duplicate handling.
- [ ] Decide whether `public/demo.mp4` needs compression before production.
- [ ] Re-run local verification on a clean checkout before merging.
