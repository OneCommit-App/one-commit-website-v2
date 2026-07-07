# AGENTS.md — OneCommit Website Release Rules

Shared contract for Codex, Claude, and subagents working the OneCommit marketing/download website. Read this before editing, then read `CHANGES.log` and `/Users/hughkopittke/Desktop/OneCommit App/ONECOMMIT_RELEASE_WAR_ROOM.md`.

## Mission

Make `https://www.onecommit.us` production-ready for athletes to download the app once real store/TestFlight/Play URLs exist. The site must be styled, fast, honest, and free of waitlist-era dead ends.

## Role Switching

- If both agents are available: one builds, the other reviews adversarially.
- If one agent is unavailable or out of usage: the other continues from `CHANGES.log` and records missing review.
- Do not wait for Hugh for routine copy, smoke checks, env validation, or release hygiene.
- Stop for billing, DNS/account changes, production env mutation, or fake/uncertain download URLs.

## Priority Order

1. Production styling/rendering and download route correctness.
2. Honest download env behavior: no fake TestFlight/App Store/Play URLs.
3. Production smoke, canonical SEO, sitemap/robots, support/privacy/terms.
4. Conversion copy, demo clarity, pricing honesty.
5. Accessibility, responsive polish, media optimization.

## Coordination Protocol

Append to `CHANGES.log` before and after release-critical work:

```text
YYYY-MM-DD HH:MM ET | agent | CLAIM/DONE/CHALLENGE/HANDOFF | lane: ... | files: ... | evidence: ... | risks/next: ...
```

Also append cross-repo blockers and green gates to the wrapper war-room.

## Commands

```bash
CI=true pnpm install --frozen-lockfile
pnpm lint
pnpm exec tsc --noEmit --incremental false
pnpm audit --prod
pnpm build
pnpm smoke:production
git diff --check
```

## Website Rules

- Never configure fake download URLs. Use empty env values and `/download` fallback until a real TestFlight/App Store/Play URL exists.
- Do not reintroduce waitlist UI, Supabase waitlist code, or waitlist copy unless Hugh explicitly asks.
- Keep `.env.example` safe: examples may describe allowed formats in comments, but values should not point to placeholder external app links.
- Production smoke should fail when no real external app download URL is present.
- Use production screenshots/smoke before claiming the public site is ready.

