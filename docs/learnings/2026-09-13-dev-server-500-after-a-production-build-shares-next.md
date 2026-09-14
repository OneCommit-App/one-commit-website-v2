# `next dev` returns 500 after another process ran `pnpm build` into the same `.next`

## Problem
The worktree's dev server on :3111 answered every route with a bare `Internal Server Error`, so CDP captures against it found no `#cta-heading`. Surface symptom: "the page lost its CTA"; real cause: a production build (download-states runs five of them) had replaced `.next` under the running dev server, which still held handles to compiled dev output that no longer existed.

## Context that mattered
- Next 15.5 dev and `next build` write to the same `.next` directory in this repo; there is no isolated dev build dir.
- `scripts/download-states.test.mjs` rebuilds `.next` five times with different env, so any long-lived dev server in the worktree is broken after it.
- The dev server may belong to another session; restarting it is not this lane's call.

## Approach
1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3111/` — a 500 with an empty-ish body and no Next error page is the signature.
2. `ls -la .next; cat .next/BUILD_ID` — a fresh `BUILD_ID` and `prerender-manifest.json` timestamped after the dev server started confirm a production build landed underneath it.
3. Do not restart someone else's dev server. Verify a spare port is free (`lsof -nP -iTCP:3240 -sTCP:LISTEN`), `pnpm build`, `pnpm exec next start -p 3240`, capture, then kill it and confirm the port is released.
4. Run the `.next`-reading gates in one uninterrupted sequence, captures between `home-ssr` and `download-states`, `download-states` last.

## Dead ends
- Assuming the curl 500 meant the page component threw: the response has no stack because there is no compiled page at all, not a broken one.
- Waiting for the dev server to "recover" on the next request: it does not; only a source change that triggers a recompile (which would then clobber the production build) or a restart fixes it.

## Reusable rule
When a Next dev server in a worktree starts returning 500 on every route, check `.next/BUILD_ID`'s mtime before debugging the app; if a build landed after the dev server started, serve captures from `next start` on a verified-free spare port instead of touching the dev server.

## Verification
`curl` on :3111 → 500; `.next/BUILD_ID` mtime 19:42 (download-states pass). `next start -p 3240` → 200 within seconds; captures taken; `lsof` afterwards printed nothing for 3240. Related: [[2026-09-13-crop-a-device-at-the-band-edge-with-negative-margin]].
